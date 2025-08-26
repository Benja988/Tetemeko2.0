// src/hooks/useAuthGuard.ts

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useAuthGuard = (redirectPath = "/admin/login") => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.warn("Redirecting due to missing user session.");
      router.replace(redirectPath);
    }
  }, [user, loading, router, redirectPath]);
};
