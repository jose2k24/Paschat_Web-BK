import { toast } from "sonner";

const BASE_URL = "https://api.paschat.net/api/v1";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

class ApiService {
  private static instance: ApiService;
  private authToken: string | null = null;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Failed to complete request");
      return { error: "Request failed" };
    }
  }

  // Auth endpoints
  async loginWithPhone(phone: string) {
    return this.request("/auth/user/web/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async loginWithQRCode(webClientId: string) {
    return this.request("/auth/user/web/qr-code/login", {
      method: "POST",
      body: JSON.stringify({ webClientId }),
    });
  }

  // Chat endpoints
  async createChatRoom(user1Phone: string, user2Phone: string) {
    return this.request("/chat/room", {
      method: "POST",
      body: JSON.stringify({ user1Phone, user2Phone }),
    });
  }

  // Contacts endpoints
  async saveContacts(contacts: string[]) {
    return this.request("/contacts/save", {
      method: "POST",
      body: JSON.stringify({ contacts }),
    });
  }

  async getSavedContacts() {
    return this.request("/contacts/save");
  }

  // File upload endpoint
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.request("/file/upload/media", {
      method: "POST",
      headers: {
        // Don't set Content-Type here, let the browser set it with the boundary
      },
      body: formData,
    });
  }
}

export const apiService = ApiService.getInstance();