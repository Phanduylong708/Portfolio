import { softWords } from "../lib/softText.js";

// React rendering of the soft-text markup: screen readers get the plain text via aria-label.
export default function SoftText({ text }) {
  return (
    <span className="soft-text" aria-label={text}>
      {softWords(text).map((part, i) =>
        !part.chars ? (
          part.space
        ) : (
          <span className="soft-word" aria-hidden="true" key={i}>
            {part.chars.map((c, j) => (
              <span className="soft-char" key={j}>
                {c}
              </span>
            ))}
          </span>
        ),
      )}
    </span>
  );
}
