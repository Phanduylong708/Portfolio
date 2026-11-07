// Soft blur-in text shared by Home and Projects: text is split into word/grapheme spans,
// and softIn() replays a per-grapheme blur-in (900ms, 25ms stagger large / 15ms compact).
const graphemes =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter("vi", { granularity: "grapheme" })
    : null;

/** Split text into words ({ word, chars }) and whitespace runs ({ space }, possibly ""). */
export function softWords(text) {
  return text.split(/(\s+)/).map((word) =>
    word.trim()
      ? { word, chars: graphemes ? Array.from(graphemes.segment(word), (v) => v.segment) : Array.from(word) }
      : { space: word },
  );
}

export function softIn(el, large = false) {
  if (!el) return;
  el.querySelectorAll(".soft-char").forEach((ch, i) => {
    ch.getAnimations().forEach((a) => a.cancel());
    ch.animate(
      [
        {
          opacity: 0,
          filter: "blur(" + (large ? 12 : 6) + "px)",
          transform: "translateY(" + (large ? 16 : 6) + "px)",
        },
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
      ],
      {
        duration: 900,
        delay: i * (large ? 25 : 15),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      },
    );
  });
}

// Magnetic pull of a round button towards the pointer while it moves over `target`.
export function magnet(el, e) {
  if (e.pointerType === "touch") return;
  const r = el.getBoundingClientRect();
  el.style.translate =
    (e.clientX - r.left - r.width / 2) * 0.18 + "px " + (e.clientY - r.top - r.height / 2) * 0.18 + "px";
}
