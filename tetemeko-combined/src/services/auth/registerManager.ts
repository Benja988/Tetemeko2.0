import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const registerManager = async (name: string, email: string, password: string, invitationCode: string) => {
  try {
    const response = await apiRequest("/auth/register-manager", "POST", {
      name,
      email,
      password,
      invitationCode,
    });

    toast.success(response.message || "Manager registered successfully! Check your email.");
    return response;
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    
    // Show detailed error messages
    toast.error(error.message || "Registration failed. Please try again.");
    throw error;
  }
};
