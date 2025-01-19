import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const DataStorageSettings = () => {
  const [storageUsed, setStorageUsed] = useState(45); // Mock value
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Cache cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cache");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Storage Usage</h3>
        <Progress value={storageUsed} className="mt-2" />
        <p className="text-sm text-gray-500 mt-1">{storageUsed}% of storage used</p>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Cache Management</h3>
        <Button 
          onClick={handleClearCache} 
          disabled={isClearing}
          variant="destructive"
        >
          {isClearing ? "Clearing..." : "Clear Cache"}
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Download Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Download Path</label>
            <input 
              type="text" 
              className="w-full mt-1 px-3 py-2 border rounded-md"
              defaultValue="/Downloads/PasChat"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};