import { routeMetadata } from "@/lib/seo/routes";
import { PageStructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { VentureArticle } from "@/components/ventures/venture-article";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return content.ventures.map(({ slug }) => ({ slug })); }
function ventureFor(slug: string) { const venture = content.ventures.find((record) => record.slug === slug); if (!venture) notFound(); return venture; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const venture = ventureFor((await params).slug); return routeMetadata(`/ventures/${venture.slug}`); }
export default async function Detail({ params }: Props) { const venture = ventureFor((await params).slug); return <><PageStructuredData path={`/ventures/${venture.slug}`} /><VentureArticle venture={venture} /></>; }
