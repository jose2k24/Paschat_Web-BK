import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export const DevicesSettings = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Chrome on Windows",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      id: "2",
      name: "Firefox on MacOS",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
  ]);

  const handleLogout = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    toast.success("Device logged out successfully");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
        
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-gray-500">IP: {device.ip}</p>
                  <p className="text-sm text-gray-500">{device.lastActive}</p>
                </div>
                {!device.current && (
                  <Button
                    variant="destructive"
                    onClick={() => handleLogout(device.id)}
                  >
                    Log Out
                  </Button>
                )}
              </div>
              {device.current && (
                <p className="text-sm text-green-500">Current Session</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};