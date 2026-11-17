"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/generated/prisma/client";

export async function createJob(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!company || !role) {
    return;
  }

  await prisma.job.create({
    data: { company, role, url: url || null },
  });

  refresh();
}

function isJobStatus(value: string): value is JobStatus {
  return Object.values(JobStatus).includes(value as JobStatus);
}

export async function updateJobStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  if (!Number.isInteger(id) || !isJobStatus(status)) {
    return;
  }

  await prisma.job.update({
    where: { id },
    data: { status },
  });

  refresh();
}

export async function deleteJob(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  await prisma.job.deleteMany({ where: { id } });

  refresh();
}
