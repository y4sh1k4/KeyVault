"use client";
import { useAuthStore } from "@/store/AuthStore";
import { setAccessToken } from "@/utils/accessToken";
import api from "@/utils/api";
import { API_URL } from "@/utils/constant";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  pid: number;
  title: string;
  description: string | null;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const email = useAuthStore((state) => state.email);
  const handleLogout = () => {
    api
      .post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        setAccessToken(null);
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const handleNewProject = () => {
    api
      .post(`${API_URL}/project/create`, {}, { withCredentials: true })
      .then(() => {
        handleFetchProject();
      })
      .catch((error) => {
        console.error("Project creation failed:", error);
      });
  };

  const handleFetchProject = () => {
    api
      .get(`${API_URL}/project`, { withCredentials: true })
      .then((response) => {
        setProjects(
          response.data.existingProject ? [response.data.existingProject] : [],
        );
        console.log("Project data:", response.data);
      })
      .catch((error) => {
        console.error("Fetch project failed:", error);
      });
  };

  useEffect(() => {
    handleFetchProject();
  }, []);

  // const projects = [
  //   {
  //     pid: 1,
  //     title: "My API Keys",
  //     description: "Production API keys and tokens",
  //     secretCount: 5,
  //   },
  //   {
  //     pid: 2,
  //     title: "Dev Environment",
  //     description: "Development secrets and configs",
  //     secretCount: 3,
  //   },
  //   {
  //     pid: 3,
  //     title: "Staging Credentials",
  //     description: null,
  //     secretCount: 8,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-white">🔐 KeyVault</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{email}</span>
            <button
              className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your Project</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Manage your secrets securely
            </p>
          </div>
          <button
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNewProject}
            disabled={projects.length === 1}
          >
            + New Project
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.pid}
              href={`/dashboard/project/${project.pid}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-lg">
                  📁
                </span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 group-hover:bg-zinc-700">
                  secrets
                </span>
              </div>
              <h3 className="mb-1 text-base font-semibold text-white">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-500">
                {project.description || "No description"}
              </p>
            </Link>
          ))}
        </div>

        {/* Empty State (hidden when projects exist) */}
        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20">
            <span className="mb-4 text-4xl">📂</span>
            <h3 className="mb-1 text-lg font-medium text-white">
              No projects yet
            </h3>
            <p className="mb-6 text-sm text-zinc-500">
              Create your first project to start storing secrets
            </p>
            <button className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
              + Create Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
