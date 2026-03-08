import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-white">🔐 KeyVault</h1>
        <p className="mb-8 max-w-md text-lg text-zinc-400">
          Securely store and manage your API keys, tokens, and secrets in one
          place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="mt-20 grid max-w-3xl gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <span className="mb-3 block text-3xl">🔒</span>
          <h3 className="mb-1 text-sm font-semibold text-white">
            Encrypted Storage
          </h3>
          <p className="text-xs text-zinc-500">
            Your secrets are encrypted and stored securely
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <span className="mb-3 block text-3xl">📁</span>
          <h3 className="mb-1 text-sm font-semibold text-white">
            Organize by Project
          </h3>
          <p className="text-xs text-zinc-500">
            Group your secrets into projects for easy management
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <span className="mb-3 block text-3xl">⚡</span>
          <h3 className="mb-1 text-sm font-semibold text-white">
            Quick Access
          </h3>
          <p className="text-xs text-zinc-500">
            Copy and reveal secrets with one click
          </p>
        </div>
      </div>
    </div>
  );
}
