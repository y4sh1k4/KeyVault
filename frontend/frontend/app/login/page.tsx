"use client";
import { useAuthStore } from "@/store/AuthStore";
import { setAccessToken } from "@/utils/accessToken";
import api from "@/utils/api";
import { API_URL } from "@/utils/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    api
      .post(
        `${API_URL}/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true },
      )
      .then((response) => {
        const { accessToken } = response.data;
        console.log("Received access token:", accessToken);
        setAccessToken(accessToken);
        login(email, accessToken);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log("login error", error);
        setError(
          error.response?.data?.message || "An error occurred during login",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">🔐 KeyVault</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Log in to access your secrets
          </p>
        </div>

        <form
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl"
          onSubmit={handleLogin}
        >
          <h2 className="mb-6 text-xl font-semibold text-white">Log In</h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <p className="mt-4 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
