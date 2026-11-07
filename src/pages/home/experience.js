// Imperative layer of the home page: lazy WebGL sculpture, soft text, magnetic links and GSAP
// scroll choreography. React renders the markup; mountHomeExperience wires behaviour onto it
// and returns a cleanup that removes every listener, tween and GL resource.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { magnet, softIn as softInShared, softWords } from "../../lib/softText.js";

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {object} o
 * @param {HTMLElement} o.root           the page's <main>
 * @param {boolean} o.reduced            prefers-reduced-motion at mount
 * @param {{ paused: boolean }} o.motion shared with the motion toggle
 * @param {() => void} o.onWebglError    called when the sculpture cannot render
 */
export function mountHomeExperience({ root, reduced, motion, onWebglError }) {
  const ac = new AbortController();
  const signal = ac.signal;
  const cleanups = [];
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const on = (el, type, fn, opts) => el?.addEventListener(type, fn, { ...opts, signal });

  // ---- WebGL sculpture (lazy) -------------------------------------------
  const canvas = root.querySelector("#sculpture");
  if (canvas) {
    import("./sculpture.js")
      .then(({ mountSculpture }) => {
        if (signal.aborted) return;
        cleanups.push(mountSculpture({ canvas, reduced, motion, onError: onWebglError }));
      })
      .catch(() => !signal.aborted && onWebglError());
  }

  // ---- Magnetic round links ---------------------------------------------
  if (!reduced)
    $$(".gallery-arrow,.project-open").forEach((el) => {
      const target = el.closest("a") ?? el;
      on(target, "pointermove", (e) => magnet(el, e));
      on(target, "pointerleave", () => (el.style.translate = "0px 0px"));
    });

  // ---- Soft blur-in text --------------------------------------------------
  const softIn = (el, large = false) => !reduced && softInShared(el, large);
  // Split only static text: links and buttons whose label never changes after mount.
  $$("a,button").forEach((el) => {
    if (el.disabled || el.querySelector("h3,img") || el.id === "motion-toggle") return;
    splitSoft(el);
    on(el, "pointerenter", (e) => {
      if (e.pointerType !== "touch") softIn(el);
    });
    on(el, "focus", () => softIn(el));
  });
  $$(".work-card").forEach((el) => {
    const title = el.querySelector("h3");
    if (!title) return;
    splitSoft(title);
    on(el, "pointerenter", (e) => {
      if (e.pointerType !== "touch") softIn(title);
    });
    on(el, "focus", () => softIn(title));
  });
  const heroTitle = root.querySelector(".gallery-panel h1");
  if (heroTitle) splitSoft(heroTitle);

  // ---- Scroll choreography ----------------------------------------------
  const gctx = gsap.context(() => {}, root);
  cleanups.push(() => gctx.revert());
  if (!reduced) {
    gctx.add(() => {
      // The progress bar sits outside <main>, so pass the element rather than a scoped selector.
      gsap.to(document.querySelector(".scroll-progress"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-top", { y: 10, opacity: 0, duration: 1 })
        .from(".gallery-orbit", { scale: 0.86, opacity: 0, duration: 1.8 }, 0.1)
        .from(".hero-visual", { opacity: 0, y: 22, duration: 2 }, 0.25)
        .from(
          ".gallery-caption,.gallery-footer,.gallery-interact",
          { y: 12, opacity: 0, duration: 1.2, stagger: 0.12 },
          0.65,
        );
      softIn(heroTitle, true);
      const heroScrub = {
        trigger: ".gallery-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      };
      gsap.to(".gallery-word", { yPercent: 22, ease: "none", scrollTrigger: heroScrub });
      gsap.to(".hero-visual", { y: 45, ease: "none", scrollTrigger: { ...heroScrub } });
      const items = ".discipline-band .discipline-item";
      gsap.from(items, {
        y: 14,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".discipline-band", start: "top 94%", once: true },
        onComplete: () => gsap.set(items, { clearProps: "transform,opacity" }),
      });
      $$(".section:not(.hero)").forEach((section) => {
        const els = section.querySelectorAll(
          ".section-head,.work-card,.about-grid>div,.contact .container",
        );
        // Anchor the contact reveal to the untransformed section, not the animated container.
        els.forEach((el, i) =>
          gsap.from(el, {
            y: 30,
            opacity: 0,
            filter: "blur(5px)",
            duration: 1.15,
            delay: Math.min((i % 3) * 0.07, 0.14),
            ease: "power3.out",
            scrollTrigger: {
              trigger: section.classList.contains("contact") ? section : el,
              start: "top 91%",
              once: true,
            },
            onComplete: () => gsap.set(el, { clearProps: "filter,transform,opacity" }),
          }),
        );
      });
    });
    document.fonts.ready.then(() => !signal.aborted && ScrollTrigger.refresh());
  }

  return () => {
    ac.abort();
    cleanups.reverse().forEach((fn) => fn());
  };
}

// Wrap each visible text node into word/grapheme spans, keeping its text as aria-label.
function splitSoft(root) {
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement.closest("svg,.soft-text,.sr-only")
        ? NodeFilter.FILTER_REJECT
        : n.textContent.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach((n) => {
    const wrapper = document.createElement("span");
    wrapper.className = "soft-text";
    wrapper.setAttribute("aria-label", n.textContent);
    softWords(n.textContent).forEach((part) => {
      if (!part.chars) {
        wrapper.append(document.createTextNode(part.space));
        return;
      }
      const w = document.createElement("span");
      w.className = "soft-word";
      w.setAttribute("aria-hidden", "true");
      part.chars.forEach((c) => {
        const ch = document.createElement("span");
        ch.className = "soft-char";
        ch.textContent = c;
        w.append(ch);
      });
      wrapper.append(w);
    });
    n.replaceWith(wrapper);
  });
}
