import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { LabArticle } from "@/components/lab/lab-article";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return content.lab.map(({ slug }) => ({ slug })); }
function entryFor(slug: string) { const entry = content.lab.find((record) => record.slug === slug); if (!entry) notFound(); return entry; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const entry = entryFor((await params).slug); return routeMetadata(`/lab/${entry.slug}`); }
export default async function Detail({ params }: Props) { const entry = entryFor((await params).slug); return <><PageStructuredData path={`/lab/${entry.slug}`} /><LabArticle entry={entry} /></>; }
