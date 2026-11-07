import { useEffect } from "react";

// Shared behaviour of every inner page: blur-in reveal on scroll, heading entrance and the
// reading-progress bar.
export function useInnerPageMotion() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();
    const animations = [];
    let io;

    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              animations.push(
                en.target.animate(
                  [
                    { opacity: 0, transform: "translateY(24px)", filter: "blur(4px)" },
                    { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
                  ],
                  { duration: 850, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
                ),
              );
              io.unobserve(en.target);
            }
          }),
        { threshold: 0.08 },
      );
      document
        .querySelectorAll(
          "main section:not(:first-child) .container > :not(.project-grid), .project-card, .post-row",
        )
        .forEach((el) => io.observe(el));
      const h1 = document.querySelector("h1");
      if (h1)
        animations.push(
          h1.animate(
            [
              { opacity: 0, filter: "blur(8px)", transform: "translateY(20px)" },
              { opacity: 1, filter: "blur(0)", transform: "translateY(0)" },
            ],
            { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)" },
          ),
        );
    }

    const bar = document.querySelector(".reading-progress");
    let ticking = false;
    let raf = 0;
    function progress() {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
      ticking = false;
    }
    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          raf = requestAnimationFrame(progress);
          ticking = true;
        }
      },
      { passive: true, signal: controller.signal },
    );
    progress();

    return () => {
      controller.abort();
      io?.disconnect();
      cancelAnimationFrame(raf);
      animations.forEach((a) => a.cancel());
    };
  }, []);
}
