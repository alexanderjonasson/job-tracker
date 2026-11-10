"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";

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
