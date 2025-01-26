import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import countries from "world-countries";
import { apiService } from "@/services/api";
import { dbService } from "@/services/db"; // Import the database service

interface PhoneLoginProps {
  onQRLogin: () => void;
}

const PhoneLogin = ({ onQRLogin }: PhoneLoginProps) => {
  const navigate = useNavigate();
  const [countryList, setCountryList] = useState(countries);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  useEffect(() => {
    const sortedCountries = countries.sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
    setCountryList(sortedCountries);
    if (sortedCountries.length > 0) {
      setSelectedCountry(sortedCountries[0]);
      setPhoneNumber(getDialCode(sortedCountries[0]));
    }
  }, []);

  const getDialCode = (country: any): string => {
    if (country.idd.root) {
      const suffix = country.idd.suffixes?.[0] || "";
      return `${country.idd.root}${suffix}`;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhoneNumber = phoneNumber.trim();
    
    const response = await apiService.webLogin(fullPhoneNumber);
    if (response.data) {
      const { account, authToken } = response.data;
      
      // Set auth token for future requests
      apiService.setAuthToken(authToken);
      wsService.setAuthToken(authToken);

      // Initialize local database
      await dbService.init();

      // Save user info
      localStorage.setItem('userPhone', account.phone);
      localStorage.setItem('userName', account.username || account.phone);
      
      toast.success("Verification code sent");
      navigate("/verify");
    } else {
      toast.error("Failed to send verification code");
    }
  };

  const handleCountryChange = (value: string) => {
    const country = countryList.find((c) => c.cca2 === value);
    if (country) {
      setSelectedCountry(country);
      const dialCode = getDialCode(country);
      setPhoneNumber(dialCode);
    }
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
            <Label htmlFor="country" className="text-gray-400">
              Country
            </Label>
            <Select
              value={selectedCountry?.cca2}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="bg-transparent border-pink-500/20 text-white">
                <SelectValue placeholder="Select a country">
                  {selectedCountry?.name.common}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2C] border-pink-500/20 max-h-[300px]">
                {countryList.map((country) => (
                  <SelectItem
                    key={country.cca2}
                    value={country.cca2}
                    className="text-white hover:bg-pink-500/20"
                  >
                    {country.name.common} ({getDialCode(country)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-400">
              Your phone number
            </Label>
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
