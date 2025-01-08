import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp === "12345") {
      toast.success("OTP verified successfully");
      navigate("/");
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2C]">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <img
            src="/lovable-uploads/1f7c8e0d-d8a1-452d-9ac8-573c29b25ef1.png"
            alt="PasChat Logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Enter Code</h1>
          <p className="text-gray-300">
            We've sent you a code to verify your phone number
          </p>
        </div>

        <div className="space-y-8">
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={5}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2 justify-center">
                {slots.map((slot, idx) => (
                  <InputOTPSlot
                    key={idx}
                    {...slot}
                    index={idx}
                    className="bg-transparent border-pink-500/20 text-white"
                  />
                ))}
              </InputOTPGroup>
            )}
          />

          <Button
            onClick={handleVerify}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;