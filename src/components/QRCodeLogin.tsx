import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { wsService } from "@/services/websocket";
import { apiService } from "@/services/api";
import { dbService } from "@/services/db";
import { toast as sonnerToast } from "sonner";

interface QRCodeLoginProps {
  onPhoneLogin: () => void;
}

const QRCodeLogin = ({ onPhoneLogin }: QRCodeLoginProps) => {
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    wsService.connectToAuth();

    const unsubscribe = wsService.subscribe("auth", "response", async (data: any) => {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
      if (parsedData.action === "createLoginQrCode" && parsedData.qrCode) {
        setQrCodeData(parsedData.qrCode);
      }
    
      if (parsedData.action === "webQrCodeLogin" && parsedData.authToken) {
        wsService.setAuthToken(parsedData.authToken);
        
        // Store user info
        if (parsedData.account) {
          localStorage.setItem("userPhone", parsedData.account.phone);
          localStorage.setItem("userName", parsedData.account.username || parsedData.account.phone);
          localStorage.setItem("authToken", parsedData.authToken);

          try {
            // Initialize database
            await dbService.init();

            // Fetch and store contacts
            const contactsResponse = await apiService.getSavedContacts();
            if (contactsResponse.data) {
              const transformedContacts = contactsResponse.data.map(contact => ({
                phone: contact.phone,
                profile: contact.profile,
                name: null,
                roomId: null
              }));
              await dbService.saveContacts(transformedContacts);
            }

            // Fetch and store chat rooms
            const roomsResponse = await apiService.getChatRooms();
            if (roomsResponse.data) {
              await Promise.all(roomsResponse.data.map(room => 
                dbService.saveChatRoom({
                  roomId: parseInt(room.roomId.toString(), 10),
                  roomType: "private",
                  createdAt: room.createdAt,
                  participants: room.participants,
                })
              ));

              // Update contacts with room IDs
              const contacts = await dbService.getContacts();
              await Promise.all(contacts.map(async contact => {
                const room = roomsResponse.data.find(room => 
                  room.participants.some(p => p.phone === contact.phone)
                );
                if (room) {
                  const roomId = parseInt(room.roomId.toString(), 10);
                  await dbService.updateContactRoomId(contact.phone, roomId);
                }
              }));
            }
          } catch (error) {
            console.error("Error initializing data:", error);
            sonnerToast.error("Failed to initialize chat data");
          }
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/chat");
      }
    });

    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, [navigate, toast]);

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white mb-2">Log in to PasChat by QR Code</h1>
        <div className="bg-white p-4 rounded-lg inline-block">
          {qrCodeData ? (
            <img 
              src={qrCodeData} 
              alt="QR Code"
              className="w-64 h-64"
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