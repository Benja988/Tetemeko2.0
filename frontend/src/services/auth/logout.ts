import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

export const logoutUser = async (router: any) => {
  try {
    // Call backend logout endpoint
    await apiRequest("/auth/logout", "POST");

    // Clear local storage & axios headers
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];

    toast.success("Logged out successfully.");
    router.push("/admin/login");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Logout failed.");
  }
};
