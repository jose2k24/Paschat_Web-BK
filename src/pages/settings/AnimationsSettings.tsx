import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AnimationsSettings = () => {
  const [animationSpeed, setAnimationSpeed] = React.useState([1]);
  const [enableAnimations, setEnableAnimations] = React.useState(true);

  const handleSave = () => {
    toast.success("Animation settings saved");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Animations and Performance
        </h2>
        <p className="text-gray-400">Customize animation settings</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Animation Speed</Label>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enableAnimations">Enable Animations</Label>
          <Switch
            id="enableAnimations"
            checked={enableAnimations}
            onCheckedChange={setEnableAnimations}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AnimationsSettings;