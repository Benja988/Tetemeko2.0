"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

// Import auth service functions
import { login } from "@/services/auth/login";
import { registerAdmin } from "@/services/auth/registerAdmin";
import { registerUser } from "@/services/auth/registerUser";
import { registerManager } from "@/services/auth/registerManager";
import { forgotPassword } from "@/services/auth/forgotPassword";
import { resendVerification } from "@/services/auth/resendVerification";
import { resetPassword } from "@/services/auth/resetPassword";
import { logoutUser as handleLogout } from "@/services/auth/logout";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  registerAdmin: (name: string, email: string, password: string, adminSecret: string) => Promise<void>;
  registerManager: (name: string, email: string, password: string, invitationCode: string, router: any) => Promise<void>;
  login: (email: string, password: string) => Promise<User | null>;
  forgotPassword: (email: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;

  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await apiRequest("/auth/profile", "GET", null, token);
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        toast.error("Session expired. Please log in again.");
        handleLogout(router);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const logout = () => {
    handleLogout(router);
    setUser(null);
  };

  const handleLogin = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = await login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      router.push("/admin/dashboard");
    }
    return loggedInUser; 
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        isManager: user?.role === "manager",
        registerUser: (name, email, password) => registerUser(name, email, password, router),
        registerAdmin: (name, email, password, adminSecret) => registerAdmin(name, email, password, adminSecret, router),
        registerManager: (name, email, password, invitationCode) => registerManager(name, email, password, invitationCode),
        login: handleLogin,
        forgotPassword,
        resendVerification,
        logout,

        resetPassword,
      }}
    >


      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
