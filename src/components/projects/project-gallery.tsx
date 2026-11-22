import Image from "next/image";
import type { Project } from "@/lib/content/schema";

export function ProjectGallery({ images }: { images: Project["gallery"] }) {
  if (!images?.length) return <p className="muted">No project screenshots are published here yet.</p>;
  return <div className="project-gallery">{images.map((image) => <figure key={image.src}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 100vw, 70vw" /><figcaption className="muted">{image.caption}</figcaption></figure>)}</div>;
}
