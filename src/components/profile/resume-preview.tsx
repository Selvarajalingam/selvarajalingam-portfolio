import type { PortfolioContent } from "@/lib/content/schema";

export function ResumePreview({ resume }: { resume: PortfolioContent["resume"] }) {
  if (!resume) return <div className="resume-unavailable"><p className="resume-status">Resume updating</p><p className="muted">A current PDF will be available here when it&apos;s ready. You can explore my experience or get in touch in the meantime.</p></div>;
  return <div className="resume-preview"><p className="resume-status">{resume.label}</p><div className="resume-actions"><a className="button button-secondary" href={resume.src}>View PDF</a><a className="text-link" href={resume.src} download>Download PDF</a></div><details><summary>Preview PDF</summary><iframe title={`${resume.label} preview`} src={resume.src} loading="lazy" /><p className="muted">If the preview is unavailable in your browser, use View PDF or Download PDF.</p></details></div>;
}
