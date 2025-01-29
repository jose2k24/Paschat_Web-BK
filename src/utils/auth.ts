import { apiService } from "@/services/api";
import { dbService } from "@/services/db";
import { wsService } from "@/services/websocket";
import { toast } from "sonner";

export const logout = async () => {
  try {
    // Call logout endpoint
    await apiService.logout();
    
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    
    // Clear database
    await dbService.clearAll();
    
    // Disconnect websocket
    wsService.disconnect();
    
    // Clear API service token
    apiService.setAuthToken(null);
    
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Error during logout");
  }
};