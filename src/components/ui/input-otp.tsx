import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "@/lib/utils"

interface OTPSlot {
  char?: string;
  hasFakeCaret?: boolean;
  isActive?: boolean;
}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { slots = [] } = inputOTPContext || {}
  const slot = (slots[index] || {}) as OTPSlot
  const { char, hasFakeCaret = false, isActive = false } = slot

  return (
    <div
      data-is-active={isActive}
      data-has-caret={hasFakeCaret}
      ref={ref}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-lg border-2 text-sm transition-all duration-200",
        isActive && "ring-2 ring-offset-2 ring-offset-background ring-telegram-blue",
        "bg-white/10 border-white/20",
        className
      )}
      data-active={isActive}
      data-fake-caret={hasFakeCaret}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {char ? (
          <span className="text-2xl font-bold text-white animate-scale-in">
            {char}
          </span>
        ) : (
          <span className="text-2xl text-white/30">-</span>
        )}
      </div>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-telegram-blue duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }