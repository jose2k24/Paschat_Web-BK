import { toast } from "sonner";

const API_BASE_URL = "https://api.example.com"; // Replace with your API URL

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      toast.error("Failed to fetch data");
      return { error: "Failed to fetch data" };
    }
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data };
    } catch (error) {
      toast.error("Failed to send data");
      return { error: "Failed to send data" };
    }
  },
};