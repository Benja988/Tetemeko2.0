import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const forgotPassword = async (email: string) => {
  try {
    await apiRequest("/auth/forgot-password", "POST", { email });
    toast.success("Reset password instructions sent to your email.");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to send reset password email.");
  }
};
