import { toast } from "sonner";

const BASE_URL = "http://vps.paschat.net/api/v1";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

interface UserAccount {
  phone: string;
  fullName: string | null;
  username: string | null;
  bio: string | null;
  profile: string | null;
}

interface WebLoginResponse {
  account: UserAccount;
  authToken: string;
}
class ApiService {
  private static instance: ApiService;
  private authToken: string | null = null;

  private constructor() {
    this.authToken = localStorage.getItem("authToken");
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem("authToken", token);
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
  async loginUser(phone: string) {
    return this.request("/auth/user/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async loginAdmin(email: string, password: string) {
    return this.request("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async setup2FA() {
    return this.request("/auth/admin/setup/2FA", {
      method: "POST",
    });
  }

  async verifyOTP(code: string) {
    return this.request("/auth/admin/verify/otp", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async sendOTP(email: string) {
    return this.request(`/auth/admin/send/otp/${email}`, {
      method: "POST",
    });
  }

  async updateUserAccount(data: {
    fullName?: string;
    username?: string;
    bio?: string;
    profile?: string | null;
  }) {
    return this.request("/auth/user/account", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateAdminAccount(data: {
    username?: string;
    fullName?: string;
    profile?: string | null;
  }) {
    return this.request("/auth/admin/account", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.request("/auth/admin/change-password", {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async createAdminAccount(email: string, role: "superAdmin" | "manager" | "moderator" | "analyst") {
    return this.request("/auth/admin/create-account", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
  }

  async logout() {
    return this.request("/auth/user/logout", {
      method: "POST",
    });
  }

  // Contacts endpoints
  async getSavedContacts() {
    return this.request<Array<{ phone: string; profile: string | null }>>('/contacts/save');
  }

  async saveContacts(contacts: string[]) {
    return this.request('/contacts/save', {
      method: 'POST',
      body: JSON.stringify({ contacts }),
    });
  }

  // Chat room endpoints
  async createChatRoom(user1Phone: string, user2Phone: string) {
    return this.request<{
      roomId: number;
      createdAt: string;
      roomType: 'private';
      participants: Array<{ id: number; phone: string }>;
    }>('/chat/room', {
      method: 'POST',
      body: JSON.stringify({ user1Phone, user2Phone }),
    });
  }

  async getChatRooms() {
    return this.request<Array<{
      roomId: number;
      roomType: string;
      createdAt: string;
      participants: Array<{ id: number; phone: string }>;
    }>>('/chat/rooms');
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

  // Community endpoints
  async createChannel(data: {
    name: string;
    description: string;
    visibility: "public" | "private";
    profile?: string;
  }) {
    return this.request("/community/channel", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createGroup(data: {
    name: string;
    description: string;
    visibility: "public" | "private";
    profile?: string;
  }) {
    return this.request("/community/group", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGroupPermissions(name: string, permissions: {
    messaging: "all" | "admins";
    mediaSharing: "all" | "admins";
    communitySharing: "all" | "admins";
    polls: "all" | "admins";
    pinning: "all" | "admins";
  }) {
    return this.request("/community/group/permissions", {
      method: "PATCH",
      body: JSON.stringify({ name, ...permissions }),
    });
  }

  async searchCommunity(keyword: string) {
    return this.request("/community/search", {
      method: "GET",
      body: JSON.stringify({ keyword }),
    });
  }

  async joinCommunity(communityId: number) {
    return this.request(`/community/${communityId}/join`, {
      method: "POST",
    });
  }

  async exitCommunity(communityId: number) {
    return this.request(`/community/${communityId}/exit`, {
      method: "DELETE",
    });
  }

  async updateChannelMemberRole(channelName: string, memberPhone: string, newRole: "admin" | "member") {
    return this.request(`/community/channel/${channelName}/role`, {
      method: "PATCH",
      body: JSON.stringify({ memberPhone, newRole }),
    });
  }

  async updateGroupMemberRole(groupName: string, memberPhone: string, newRole: "admin" | "member") {
    return this.request(`/community/group/${groupName}/role`, {
      method: "PATCH",
      body: JSON.stringify({ memberPhone, newRole }),
    });
  }

  async getUserCommunities() {
    return this.request("/community/all/user");
  }

  async getCommunityDetails(communityId: number) {
    return this.request(`/community/details/${communityId}`);
  }

  async deleteCommunity(communityId: number) {
    return this.request("/community", {
      method: "DELETE",
      body: JSON.stringify({ communityId }),
    });
  }

  async webLogin(phone: string): Promise<ApiResponse<WebLoginResponse>> {
    return this.request("/auth/user/web/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }
}
export const apiService = ApiService.getInstance();
