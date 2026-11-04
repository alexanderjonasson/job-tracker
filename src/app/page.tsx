import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

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
          <p className="text-sm text-gray-500">{job.status}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Job Tracker</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <JobList />
      </Suspense>
    </main>
  );
}
