import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const resendVerification = async (email: string) => {
  console.log("📩 Sending resend verification request for:", email); // ✅ Debug log

  try {
    const response = await apiRequest("/auth/resend-verification", "POST", { email }, null); // ✅ No token required
    console.log("✅ Response received:", response);
    toast.success("Verification email resent successfully. Check your inbox!");
    return response;
  } catch (error) {
    console.error("❌ Error resending verification:", error);
    toast.error(error instanceof Error ? error.message : "Failed to resend verification email.");
    throw error;
  }
};
