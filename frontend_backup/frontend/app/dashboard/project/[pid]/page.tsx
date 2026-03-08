"use client";
import { useAuthStore } from "@/store/AuthStore";
import api from "@/utils/api";
import { API_URL } from "@/utils/constant";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  pid: number;
  title: string;
  description: string | null;
}

interface Secret {
  sid: number;
  key: string;
  value: string;
}

export default function ProjectSecretsPage() {
  const { pid } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const email = useAuthStore((state) => state.email);
  const [revealed, setRevealed] = useState<{ [sid: number]: boolean }>({});
  const [showForm, setShowForm] = useState(false);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const handleFetchProject = () => {
    api
      .post(
        `${API_URL}/project`,
        { pid: Number(pid) },
        { withCredentials: true },
      )
      .then((response) => {
        setProject(response.data.project);
        console.log("Project data:", response.data);
      })
      .catch((error) => {
        console.error("Fetch project failed:", error);
      });
  };

  const handleFetchSecrets = () => {
    api
      .get(`${API_URL}/secret/all`, { withCredentials: true })
      .then((response) => {
        setSecrets(response.data.secrets);
        console.log("Secrets data:", response.data);
      })
      .catch((error) => {
        console.error("Fetch secrets failed:", error);
      });
  };

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        alert("Secret value copied to clipboard!");
      })
      .catch((error) => {
        console.error("Copy failed:", error);
        alert("Failed to copy secret value.");
      });
  };
  const handleAddSecret = ({ key, value }: { key: string; value: string }) => {
    api
      .post(
        `${API_URL}/secret/create`,
        { key, value },
        { withCredentials: true },
      )
      .then((response) => {
        console.log("Secret created:", response.data);
        handleFetchSecrets();
      })
      .catch((error) => {
        console.error("Create secret failed:", error);
      });
  };
  useEffect(() => {
    handleFetchProject();
    handleFetchSecrets();
  }, []);

  // const secrets = [
  //   { sid: 1, key: "DATABASE_URL", value: "postgresql://user:pass@localhost:5432/db" },
  //   { sid: 2, key: "API_KEY", value: "sk-abc123xyz456def789" },
  //   { sid: 3, key: "JWT_SECRET", value: "super-secret-jwt-key-here" },
  //   { sid: 4, key: "STRIPE_KEY", value: "sk_live_abc123" },
  //   { sid: 5, key: "AWS_ACCESS_KEY", value: "AKIAIOSFODNN7EXAMPLE" },
  // ];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-sm text-zinc-500">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-white">🔐 KeyVault</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{email}</span>
            <button className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800">
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/dashboard" className="transition hover:text-zinc-300">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{project.title}</span>
        </div>

        {/* Project Info */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {project.description || "No description"}
            </p>
          </div>
          <button
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            onClick={() => setShowForm((v) => !v)}
          >
            + Add Secret
          </button>
        </div>

        {showForm && (
          <form
            className="mb-8 flex gap-4 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSecret({ key: newKey, value: newValue });
              setNewKey("");
              setNewValue("");
              setShowForm(false);
            }}
          >
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Key</label>
              <input
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Value</label>
              <input
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Save
            </button>
          </form>
        )}

        {/* Secrets Table */}
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {secrets.map((secret) => (
                <tr
                  key={secret.sid}
                  className="bg-zinc-900/50 transition hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-4">
                    <span className="rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-indigo-400">
                      {secret.key}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-zinc-400">
                      {revealed[secret.sid] ? secret.value : "••••••••••••••••"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="cursor-pointer rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        onClick={() =>
                          setRevealed((prev) => ({
                            ...prev,
                            [secret.sid]: !prev[secret.sid],
                          }))
                        }
                      >
                        {revealed[secret.sid] ? "🙈 Hide" : "👁️ Reveal"}
                      </button>
                      <button
                        className="cursor-pointer rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        onClick={() => handleCopy(secret.value)}
                      >
                        📋 Copy
                      </button>
                      {/* <button className="cursor-pointer rounded-md border border-red-900 px-3 py-1 text-xs text-red-400 transition hover:bg-red-900/30">
                        🗑 Delete
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {secrets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20">
            <span className="mb-4 text-4xl">🔑</span>
            <h3 className="mb-1 text-lg font-medium text-white">
              No secrets yet
            </h3>
            <p className="mb-6 text-sm text-zinc-500">
              Add your first secret to this project
            </p>
            <button
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              onClick={() => setShowForm((v) => !v)}
            >
              + Add Secret
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
