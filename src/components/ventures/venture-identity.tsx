import Image from "next/image";
import type { Venture } from "@/lib/content/schema";

export function VentureIdentity({ venture }: { venture: Venture }) {
  return venture.logo ? <Image className="venture-logo" src={venture.logo.src} alt={venture.logo.alt} width={venture.logo.width} height={venture.logo.height} sizes="(max-width: 700px) 70vw, 320px" /> : null;
}
