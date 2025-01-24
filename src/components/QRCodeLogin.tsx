import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface QRCodeLoginProps {
  onPhoneLogin: () => void;
}

const QRCodeLogin = ({ onPhoneLogin }: QRCodeLoginProps) => {
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Connect to WebSocket
    const wsConnection = new WebSocket("wss://api.paschat.net/ws");

    wsConnection.onopen = () => {
      console.log("WebSocket Connected");
      // Request QR code after connection
      wsConnection.send(JSON.stringify({
        action: "createLoginQrCode"
      }));
    };

    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.action === "createLoginQrCode" && data.qrCode) {
        setQrCodeData(data.qrCode);
      }
      
      if (data.action === "webQrCodeLogin") {
        // Handle successful login
        localStorage.setItem("authToken", data.authToken);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/");
      }
    };

    wsConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    };

    setWs(wsConnection);

    // Cleanup on unmount
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [navigate, toast]);

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white mb-2">Log in to PasChat by QR Code</h1>
        <div className="bg-white p-4 rounded-lg inline-block">
          {qrCodeData ? (
            <QRCodeSVG
              value={qrCodeData}
              size={256}
              level="H"
              includeMargin={true}
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 text-white">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm">1</span>
            <p className="text-left">Open PasChat on your phone</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm">2</span>
            <p className="text-left">Go to Settings {'>'} Devices {'>'} Link Desktop Device</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm">3</span>
            <p className="text-left">Point your phone at this screen to confirm login</p>
          </div>
        </div>
      </div>

      <Button
        onClick={onPhoneLogin}
        variant="ghost"
        className="text-pink-500 hover:text-pink-400 hover:bg-white/5"
      >
        LOG IN BY PHONE NUMBER
      </Button>
    </div>
  );
};

export default QRCodeLogin;