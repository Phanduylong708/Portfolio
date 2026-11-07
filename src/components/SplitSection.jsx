import Lines from "./Lines.jsx";

// Two-column section: numbered title on the left, content on the right.
export default function SplitSection({ eyebrow, title, id, className = "", children }) {
  const headingId = id && `${id}-title`;
  return (
    <section className={`section ${className}`.trim()} id={id} aria-labelledby={headingId}>
      <div className="container grid-1-2 body-grid">
        <div className="aside-title">
          <span>{eyebrow}</span>
          <h2 id={headingId}>
            <Lines text={title} />
          </h2>
        </div>
        <div className="split-body">{children}</div>
      </div>
    </section>
  );
}
