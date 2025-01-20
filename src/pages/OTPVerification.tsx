import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer: number;
    if (resendTimer > 0) {
      timer = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 5) {
      setError("Please enter all 5 digits");
      return;
    }
    
    setIsVerifying(true);
    setError("");

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === "12345") {
      toast.success("OTP verified successfully");
      navigate("/");
    } else {
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP");
    }
    setIsVerifying(false);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      toast.success("New OTP sent successfully");
      setResendTimer(30);
      setOtp("");
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-telegram-dark to-[#2C1A2C] p-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
        <div className="text-center">
          <img
            src="/lovable-uploads/1f7c8e0d-d8a1-452d-9ac8-573c29b25ef1.png"
            alt="PasChat Logo"
            className="w-20 h-20 mx-auto mb-4 animate-scale-in"
          />
          <h1 className="text-3xl font-bold text-white mb-2 font-sans">Enter Code</h1>
          <p className="text-gray-300 mb-8">
            We've sent you a code to verify your phone number
          </p>
        </div>

        <div className="space-y-8">
          <InputOTP
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            maxLength={5}
            render={({ slots }) => (
              <InputOTPGroup className="flex gap-3 justify-center">
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    {...slot}
                    index={index}
                    className="w-14 h-14 text-2xl font-bold bg-white/10 border-2 border-white/20 text-white rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 placeholder-white/30 animate-scale-in"
                    aria-label={`OTP Digit ${index + 1}`}
                  />
                ))}
              </InputOTPGroup>
            )}
          />

          {error && (
            <p className="text-red-400 text-sm text-center animate-fade-in" role="alert">
              {error}
            </p>
          )}

          <Button
            onClick={handleVerify}
            disabled={isVerifying || otp.length !== 5}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "VERIFY"
            )}
          </Button>

          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-gray-300 hover:text-white text-sm transition-colors disabled:opacity-50"
            >
              {resendTimer > 0 ? (
                `Resend code in ${resendTimer}s`
              ) : (
                "Resend code"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;