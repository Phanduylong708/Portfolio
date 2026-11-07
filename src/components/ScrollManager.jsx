import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigationType } from "react-router";

// Scroll positions per history entry, so Back/Forward land where the reader left.
const positions = new Map();
// The browser restores reload position before React has rendered, so keep it ourselves.
const reloadKey = () => "portfolio:scroll:" + location.href;

// Restore scroll the way a multi-page site would:
// - first load: jump to the #hash target; reload: restore the position the reader left;
// - Back/Forward to another page: restore that entry's position;
// - new page: start at the top, or jump to the #hash target (honouring scroll-padding-top);
// - #hash change on the same page: scroll with the page's own CSS scroll-behavior;
// - query mirrored in place (search box, history.replace): keep the position.
// Receives the location that is actually on screen, so a route transition scrolls at the
// moment the pages swap rather than while the old page is still animating out.
export default function ScrollManager({ location }) {
  const { pathname, search, hash, key } = location;
  // A different path or query string counts as a different page.
  const page = pathname + search;
  const navigationType = useNavigationType();
  const prevPage = useRef(null);
  const prevPathname = useRef(null);
  const currentKey = useRef(key);

  useEffect(() => {
    const save = () => positions.set(currentKey.current, window.scrollY);
    const saveForReload = () => {
      try {
        sessionStorage.setItem(reloadKey(), String(window.scrollY));
      } catch {
        // Storage can be unavailable (private mode); scroll restore is best-effort.
      }
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", saveForReload);
    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", saveForReload);
    };
  }, []);

  useLayoutEffect(() => {
    const firstLoad = prevPage.current === null;
    const inPlace =
      navigationType === "REPLACE" && prevPathname.current === pathname;
    const samePage = prevPage.current === page || inPlace;
    prevPage.current = page;
    prevPathname.current = pathname;
    currentKey.current = key;
    const target = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;
    if (firstLoad) {
      // The app renders after the browser's own fragment jump / reload restoration.
      const nav = performance.getEntriesByType("navigation")[0];
      let saved = null;
      try {
        saved = sessionStorage.getItem(reloadKey());
        sessionStorage.removeItem(reloadKey());
      } catch {
        // Storage can be unavailable (private mode); scroll restore is best-effort.
      }
      if (nav?.type === "reload" && saved !== null)
        window.scrollTo({ top: Number(saved), left: 0, behavior: "instant" });
      else if (target) target.scrollIntoView({ behavior: "instant" });
      return;
    }
    if (navigationType === "POP" && !samePage && positions.has(key)) {
      window.scrollTo({
        top: positions.get(key),
        left: 0,
        behavior: "instant",
      });
      return;
    }
    if (inPlace) return;
    if (target)
      target.scrollIntoView(samePage ? undefined : { behavior: "instant" });
    else if (!samePage)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [page, pathname, hash, key, navigationType]);

  return null;
}
