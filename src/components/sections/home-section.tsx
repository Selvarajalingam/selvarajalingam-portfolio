import type { ReactNode } from "react";

export function HomeSection({ id, label, heading, children, className = "" }: {
  id: string; label: string; heading: string; children: ReactNode; className?: string;
}) {
  return <section id={id} className={`home-section shell ${className}`} aria-labelledby={`${id}-heading`}>
    <div className="section-heading"><p className="section-label">{label}</p><h2 id={`${id}-heading`}>{heading}</h2></div><div className="section-body">{children}</div>
  </section>;
}
