import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Two route transitions, picked by destination:
// - "curtain": entering or leaving Home — a panel wipes up over the page, then lifts away;
// - "fade":    between inner pages — the page blurs out and the next one slides in.
// The old page stays rendered until its exit finishes, then the latest location is swapped in.
// Pages never overlap, so their per-page stylesheets never share the cascade.
export const transitionKind = (from, to) => (from === "/" || to === "/" ? "curtain" : "fade");

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageParts = (view) => view.querySelectorAll("main, .pagefoot");

function exitTimeline(kind, { view, curtain }) {
  const tl = gsap.timeline();
  if (kind === "curtain") {
    tl.set(curtain, { visibility: "visible", pointerEvents: "auto", transformOrigin: "50% 100%" })
      .to(curtain, { scaleY: 1, duration: 0.55, ease: "power3.inOut" })
      .fromTo(
        curtain.firstElementChild,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.25,
      );
  } else {
    tl.to(pageParts(view), {
      opacity: 0,
      y: -48,
      filter: "blur(12px)",
      duration: 0.45,
      ease: "power3.in",
    });
  }
  return tl;
}

function enterTimeline(kind, { view, curtain }) {
  const parts = pageParts(view);
  const tl = gsap.timeline();
  if (kind === "curtain") {
    tl.set(curtain, { transformOrigin: "50% 0%" })
      .to(curtain.firstElementChild, { opacity: 0, y: -16, duration: 0.25, ease: "power2.in" })
      .to(curtain, { scaleY: 0, duration: 0.65, ease: "power3.inOut" }, 0.1)
      .from(parts, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.3)
      .set(curtain, { visibility: "hidden", pointerEvents: "none" });
  } else {
    tl.fromTo(
      parts,
      { opacity: 0, y: 72, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
    );
  }
  // Leave no inline styles behind: sticky/fixed descendants break under a transformed parent.
  return tl.set(parts, { clearProps: "opacity,transform,filter" });
}

function resetCurtain(curtain) {
  gsap.set(curtain, { scaleY: 0, visibility: "hidden", pointerEvents: "none" });
  gsap.set(curtain.firstElementChild, { opacity: 0 });
}

/**
 * @param {import("react-router").Location} location the router's current location
 * @returns {{ displayLocation, viewRef, curtainRef, curtainPath }}
 */
export function useRouteTransition(location) {
  const [displayLocation, setDisplayLocation] = useState(location);
  const [curtainPath, setCurtainPath] = useState(location.pathname);
  const viewRef = useRef(null);
  const curtainRef = useRef(null);
  const displayed = useRef(location);
  const latest = useRef(location);
  const phase = useRef("idle"); // idle | exiting | entering
  const kind = useRef(null);
  const timeline = useRef(null);

  const swap = (next) => {
    displayed.current = next;
    setDisplayLocation(next);
  };

  useEffect(() => {
    latest.current = location;
    if (location.key === displayed.current.key) return;
    const els = { view: viewRef.current, curtain: curtainRef.current };

    // Same page (hash or query change) or reduced motion: swap without animating.
    if (location.pathname === displayed.current.pathname || reducedMotion()) {
      timeline.current?.kill();
      gsap.set(pageParts(els.view), { clearProps: "opacity,transform,filter" });
      resetCurtain(els.curtain);
      phase.current = "idle";
      kind.current = null;
      swap(location);
      return;
    }

    // An exit is already running: it will swap in whatever location is latest when it ends.
    if (phase.current === "exiting") return;

    // Interrupt an entrance and leave from wherever it got to.
    timeline.current?.kill();
    kind.current = transitionKind(displayed.current.pathname, location.pathname);
    if (kind.current === "fade") resetCurtain(els.curtain);
    setCurtainPath(location.pathname);
    phase.current = "exiting";
    timeline.current = exitTimeline(kind.current, els).eventCallback("onComplete", () => {
      swap(latest.current);
    });
  }, [location]);

  // The new page is in the DOM but not yet painted: start its entrance.
  useLayoutEffect(() => {
    if (phase.current !== "exiting") return;
    const els = { view: viewRef.current, curtain: curtainRef.current };
    phase.current = "entering";
    // Move focus to the new page for keyboard and screen reader users.
    const main = els.view.querySelector("main");
    if (main) {
      main.tabIndex = -1;
      main.focus({ preventScroll: true });
    }
    timeline.current = enterTimeline(kind.current, els).eventCallback("onComplete", () => {
      phase.current = "idle";
    });
  }, [displayLocation]);

  useLayoutEffect(() => {
    resetCurtain(curtainRef.current);
    return () => timeline.current?.kill();
  }, []);

  return { displayLocation, viewRef, curtainRef, curtainPath };
}
