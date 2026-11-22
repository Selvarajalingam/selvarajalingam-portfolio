type JourneyEntry = { slug: string; title: string; body: string };

export function JourneyTimeline({ entries }: { entries: JourneyEntry[] }) {
  return <ol className="profile-timeline">{entries.map((entry) => <li key={entry.slug}><h3>{entry.title}</h3><p className="muted">{entry.body}</p></li>)}</ol>;
}
