"use client";

import clsx from "clsx";
import { useT } from "@/lib/i18n/client";

const STYLES: Record<string, string> = {
  PENDING: "border-accent-500 text-accent-600 bg-accent-100",
  APPROVED: "border-brand-500 text-brand-500 bg-brand-50",
  REJECTED: "border-danger-500 text-danger-500",
};

export default function LeaveStatusBadge({ status }: { status: string }) {
  const t = useT();
  return <span className={clsx("stamp", STYLES[status] || "border-ink-faint text-ink-muted")}>{t(status)}</span>;
}
