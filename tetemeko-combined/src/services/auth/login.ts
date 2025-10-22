// src/services/auth/login.ts

import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { resendVerification } from "./resendVerification";

export const login = async (email: string, password: string): Promise<any | null> => {
  try {
    const data = await apiRequest("/auth/login", "POST", { email, password });

    // Fetch updated user profile
    const freshUser = await apiRequest("/auth/profile", "GET", null, data.token);

    if (!freshUser.isVerified) {
      toast.warning("Please verify your email before accessing the dashboard.");

      setTimeout(() => {
        toast.info("Click here to resend verification email", {
          action: {
            label: "Resend",
            onClick: () => resendVerification(email),
          },
        });
      }, 1000);
      
      toast.error("Email not verified. Verification required.");
      return null; // ✅ Return null instead of throwing an error
    }

    // Save user session
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(freshUser));

    toast.success("Login successful! Redirecting...");
    return freshUser; // ✅ Return user data
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Invalid email or password.");
    return null; // ✅ Return null on failure
  }
};
