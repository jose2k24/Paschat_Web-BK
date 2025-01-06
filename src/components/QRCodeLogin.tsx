import { Button } from "@/components/ui/button";

interface QRCodeLoginProps {
  onPhoneLogin: () => void;
}

const QRCodeLogin = ({ onPhoneLogin }: QRCodeLoginProps) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white mb-2">Log in to PasChat by QR Code</h1>
        <img 
          src="/lovable-uploads/0601418b-5753-4abe-9b27-abbf140e1228.png" 
          alt="QR Code"
          className="mx-auto w-64 h-64"
        />
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