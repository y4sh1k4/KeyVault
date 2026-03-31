"use client";
import { useEffect, useState } from "react";
import { getAccessToken, refreshAccessToken } from "@/utils/accessToken";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/AuthStore";

const publicRoutes = ["/", "/login", "/signup"];
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(() => !getAccessToken());
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  useEffect(() => {
    if (!getAccessToken()) {
      console.log("No access token found, attempting to refresh");
      refreshAccessToken()
        .then((newToken) => {
          if (newToken && isPublicRoute) {
            login(newToken.email, newToken.accessToken);
            router.push("/dashboard");
          } else {
            if (!["/login", "/signup"].includes(pathname)) {
              router.push("/login");
            }
          }
        })
        .catch(() => {
          if (!["/login", "/signup"].includes(pathname)) {
            router.push("/login");
          }
        })
        .finally(() => setLoading(false));
    } else {
      console.log("Access token exists");
      if (isPublicRoute) {
        router.push("/dashboard");
      }
      setTimeout(() => setLoading(false), 0);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400 text-sm">Loading...</div>
      </div>
    );
  }
  return <>{children}</>;
}
