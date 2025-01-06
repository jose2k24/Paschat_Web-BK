import { useState } from "react";
import { Button } from "@/components/ui/button";
import QRCodeLogin from "@/components/QRCodeLogin";
import PhoneLogin from "@/components/PhoneLogin";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<"qr" | "phone">("qr");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2C]">
      <div className="w-full max-w-md p-8">
        {loginMethod === "qr" ? (
          <QRCodeLogin onPhoneLogin={() => setLoginMethod("phone")} />
        ) : (
          <PhoneLogin onQRLogin={() => setLoginMethod("qr")} />
        )}
      </div>
    </div>
  );
};

export default Login;