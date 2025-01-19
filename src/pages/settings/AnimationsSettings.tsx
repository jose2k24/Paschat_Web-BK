import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, Gauge, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AnimationsSettings = () => {
  const [animationSpeed, setAnimationSpeed] = React.useState([1]);
  const [enableAnimations, setEnableAnimations] = React.useState(true);
  const [isTestingPerformance, setIsTestingPerformance] = React.useState(false);
  const [performanceScore, setPerformanceScore] = React.useState(0);

  const handleSave = () => {
    toast.success("Animation settings saved");
  };

  const runPerformanceTest = async () => {
    setIsTestingPerformance(true);
    setPerformanceScore(0);
    
    // Simulate performance test
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setPerformanceScore(i);
    }
    
    setIsTestingPerformance(false);
    toast.success("Performance test completed");
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Animations and Performance
        </h2>
        <p className="text-gray-400">Customize animation settings</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Animation Speed</Label>
            <span className="text-sm text-gray-400">
              {animationSpeed[0]}x
            </span>
          </div>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={2}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableAnimations">Enable Animations</Label>
            <p className="text-sm text-gray-400">Toggle all animations</p>
          </div>
          <Switch
            id="enableAnimations"
            checked={enableAnimations}
            onCheckedChange={setEnableAnimations}
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Performance Diagnostics
          </h3>
          
          <div className="bg-gray-800 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Performance Score</p>
                <p className="text-sm text-gray-400">Test your app's responsiveness</p>
              </div>
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            
            <Progress value={performanceScore} className="h-2" />
            
            <Button 
              onClick={runPerformanceTest}
              disabled={isTestingPerformance}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isTestingPerformance ? "Running Test..." : "Run Performance Test"}
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AnimationsSettings;