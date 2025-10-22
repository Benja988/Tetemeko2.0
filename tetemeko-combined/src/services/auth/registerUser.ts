import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  router: any
) => {
  try {
    await apiRequest("/auth/register-user", "POST", { name, email, password });
    toast.success("User registered successfully! Please verify your email.");
    router.push("/auth/verify-email");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to register user.");
  }
};
