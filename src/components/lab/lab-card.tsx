import Image from "next/image";
import Link from "next/link";
import type { LabSummary } from "@/lib/lab";
import { StatusBadge } from "./status-badge";

export function LabCard({ entry }: { entry: LabSummary }) {
  return <article className="lab-card">{entry.image && <Image src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} sizes="(max-width: 700px) 100vw, 50vw" />}
    <p className="muted lab-card-category">{entry.category}</p><StatusBadge status={entry.status} /><h3><Link href={`/lab/${entry.slug}`}>{entry.title}</Link></h3><p>{entry.summary}</p><p className="muted lab-card-progress">{entry.progressSummary}</p>
  </article>;
}
