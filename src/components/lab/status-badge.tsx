import type { LabExperiment } from "@/lib/content/schema";

export function StatusBadge({ status }: { status: LabExperiment["status"] }) {
  return <span className="lab-status" data-status={status}>{status}</span>;
}
