import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/generated/prisma/client";
import { createJob, updateJobStatus } from "./actions";

async function JobList() {
  await connection();
  const jobs = await prisma.job.findMany({ orderBy: { appliedAt: "desc" } });

  if (jobs.length === 0) {
    return <p className="text-gray-500">No applications yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {jobs.map((job) => (
        <li key={job.id} className="rounded border p-3">
          <p className="font-semibold">{job.company}</p>
          <p>{job.role}</p>
          <form action={updateJobStatus} className="mt-2 flex gap-2">
            <input type="hidden" name="id" value={job.id} />
            <select
              name="status"
              defaultValue={job.status}
              className="rounded border p-1 text-sm">
              {Object.values(JobStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded border px-2 text-sm">
              Update
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

function AddJobForm() {
  return (
    <form action={createJob} className="mb-8 space-y-3 rounded border p-4">
      <input
        name="company"
        placeholder="Company"
        required
        className="w-full rounded border p-2"
      />
      <input
        name="role"
        placeholder="Role"
        required
        className="w-full rounded border p-2"
      />
      <input
        name="url"
        type="url"
        placeholder="Link to the job ad (optional)"
        className="w-full rounded border p-2"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        Add application
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Job Tracker</h1>
      <AddJobForm />
      <Suspense fallback={<p>Loading...</p>}>
        <JobList />
      </Suspense>
    </main>
  );
}
