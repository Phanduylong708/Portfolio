// A dated row in the resume timeline.
export default function TimelineEntry({ start, end, title, subtitle, children }) {
  return (
    <article className="log-row timeline-entry">
      <span className="meta">
        <time>{start}</time> — <time>{end}</time>
      </span>
      <div>
        <h3>{title}</h3>
        {subtitle && <p className="timeline-sub">{subtitle}</p>}
        {children}
      </div>
    </article>
  );
}
