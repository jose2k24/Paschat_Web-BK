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
  const { char = "", hasFakeCaret = false, isActive = false } = slot

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center text-center transition-all duration-200",
        isActive && "ring-2 ring-offset-2 ring-offset-background",
        className
      )}
      {...props}
    >
      {char || (
        <span className="text-muted-foreground animate-pulse">-</span>
      )}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }