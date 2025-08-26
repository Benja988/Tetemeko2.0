// src/services/auth/registerAdmin.ts

import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const registerAdmin = async (
  name: string,
  email: string,
  password: string,
  adminSecret: string,
  router: any
) => {
  try {
    const response = await apiRequest("/auth/register-admin", "POST", { name, email, password, adminSecret });

    // ✅ Ensure response contains correct status and does not blindly assume success
    if (!response || !response.message || response.status >= 400) {
      throw new Error(response.message || "Failed to register admin.");
    }

    toast.success("Admin registered successfully! Redirecting to login...");
    router.push("/admin/login");
  } catch (error) {
    let errorMessage = "Failed to register admin.";

    // ✅ Handle specific error messages
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null && "message" in error) {
      errorMessage = error.message as string;
    }

    toast.error(errorMessage);
    throw new Error(errorMessage); // Rethrow to be caught in `handleSubmit`
  }
};
