import type { JobStatus } from "@/generated/prisma/client";

export const statusLabels: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const statusStyles: Record<JobStatus, string> = {
  APPLIED: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  INTERVIEW:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  OFFER: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  REJECTED: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};
