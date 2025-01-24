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
import { getCountries } from "world-countries";

interface PhoneLoginProps {
  onQRLogin: () => void;
}

interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
}

const PhoneLogin = ({ onQRLogin }: PhoneLoginProps) => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  useEffect(() => {
    const fetchedCountries = getCountries().sort((a, b) => 
      a.name.common.localeCompare(b.name.common)
    );
    setCountries(fetchedCountries);
    // Set default country (first country in the sorted list)
    if (fetchedCountries.length > 0) {
      setSelectedCountry(fetchedCountries[0]);
      setPhoneNumber(getDialCode(fetchedCountries[0]));
    }
  }, []);

  const getDialCode = (country: Country): string => {
    if (country.idd.root) {
      const suffix = country.idd.suffixes?.[0] || "";
      return `${country.idd.root}${suffix}`;
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numberWithoutCode = phoneNumber.replace(getDialCode(selectedCountry!), "").trim();
    
    if (numberWithoutCode === "1234567890") {
      toast.success("Verification code sent");
      navigate("/verify");
    } else {
      toast.error("Please use the mock number: 1234567890");
    }
  };

  const handleCountryChange = (value: string) => {
    const country = countries.find((c) => c.cca2 === value);
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
                {countries.map((country) => (
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