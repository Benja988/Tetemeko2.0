import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    await apiRequest(`/auth/reset-password?token=${encodeURIComponent(token)}`, "POST", {
      newPassword,
    });
    toast.success("Password reset successful. You can now log in.");
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to reset password. Try again."
    );
    throw error; // Rethrow for the caller to handle if needed
  }
};
