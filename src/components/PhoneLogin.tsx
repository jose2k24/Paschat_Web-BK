import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface PhoneLoginProps {
  onQRLogin: () => void;
}

const PhoneLogin = ({ onQRLogin }: PhoneLoginProps) => {
  const [country, setCountry] = useState("Ethiopia");
  const [phoneNumber, setPhoneNumber] = useState("+251");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in with:", { country, phoneNumber, keepSignedIn });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <img 
          src="/lovable-uploads/1f7c8e0d-d8a1-452d-9ac8-573c29b25ef1.png" 
          alt="PasChat Logo" 
          className="w-20 h-20 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-white mb-2">PasChat</h1>
        <p className="text-gray-300">
          Please confirm your country code and enter your phone number
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="country" className="text-gray-400">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent border-pink-500/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-400">Your phone number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-transparent border-pink-500/20 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepSignedIn"
              checked={keepSignedIn}
              onCheckedChange={(checked) => setKeepSignedIn(checked as boolean)}
              className="border-pink-500 data-[state=checked]:bg-pink-500"
            />
            <label
              htmlFor="keepSignedIn"
              className="text-sm font-medium leading-none text-white cursor-pointer"
            >
              Keep me signed in
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            NEXT
          </Button>

          <Button
            type="button"
            onClick={onQRLogin}
            variant="ghost"
            className="w-full text-pink-500 hover:text-pink-400 hover:bg-white/5"
          >
            LOG IN BY QR CODE
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PhoneLogin;