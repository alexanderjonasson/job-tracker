import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/generated/prisma/client";
import { statusLabels, statusStyles } from "@/lib/status";
import { createJob, deleteJob, updateJobStatus } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

async function JobList() {
  await connection();
  const jobs = await prisma.job.findMany({ orderBy: { appliedAt: "desc" } });

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <p className="font-medium">No applications yet</p>
        <p className="mt-1 text-sm">
          Add your first application above to get started.
        </p>
      </div>
    );
  }

  const interviews = jobs.filter((job) => job.status === "INTERVIEW").length;
  const offers = jobs.filter((job) => job.status === "OFFER").length;

  return (
    <section>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat label="Applications" value={jobs.length} />
        <Stat label="Interviews" value={interviews} />
        <Stat label="Offers" value={offers} />
      </div>

      <ul className="space-y-3">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{job.company}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.role}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}>
                {statusLabels[job.status]}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-gray-500 dark:text-gray-400">
              <span>Applied {dateFormat.format(job.appliedAt)}</span>
              {job.url?.startsWith("http") && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400">
                  View ad ↗
                </a>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
              <form action={updateJobStatus} className="flex gap-2">
                <input type="hidden" name="id" value={job.id} />
                <select
                  name="status"
                  defaultValue={job.status}
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-950">
                  {Object.values(JobStatus).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  Update
                </button>
              </form>
              <form action={deleteJob}>
                <input type="hidden" name="id" value={job.id} />
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AddJobForm() {
  return (
    <form
      action={createJob}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold">Add application</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Company</span>
          <input
            name="company"
            required
            placeholder="e.g. Spotify"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Role</span>
          <input
            name="role"
            required
            placeholder="e.g. Frontend Developer"
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">
            Link to the job ad{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </span>
          <input
            name="url"
            type="url"
            placeholder="https://"
            className={inputClass}
          />
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Add application
        </button>
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Keep track of every application in one place.
        </p>
      </header>
      <AddJobForm />
      <Suspense
        fallback={<p className="text-gray-500">Loading applications...</p>}>
        <JobList />
      </Suspense>
    </main>
  );
}
