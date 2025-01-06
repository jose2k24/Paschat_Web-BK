import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, ArrowLeft, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfilePopup = ({ open, onOpenChange }: ProfilePopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-[#1A1F2C] text-white overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2C]">
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <Search className="h-5 w-5" />
              <MoreVertical className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-medium">
                R
              </div>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="px-6 pt-20 pb-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
              Rakkun
              <span className="text-2xl">🤘</span>
            </h2>
            <p className="text-green-500">online</p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-pink-500 font-medium mb-2">Account</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white">+380 (53) 637 67 90</p>
                  <p className="text-gray-400 text-sm">Tap to change phone number</p>
                </div>
                <div>
                  <p className="text-white">@coolestboiever</p>
                  <p className="text-gray-400 text-sm">Username</p>
                </div>
                <div>
                  <p className="text-white">i like trains</p>
                  <p className="text-gray-400 text-sm">Bio</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-pink-500 font-medium mb-2">Settings</h3>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};