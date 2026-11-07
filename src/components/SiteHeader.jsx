import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { NAV_ITEMS } from "../data/navigation.js";
import { useI18n } from "../i18n/useI18n.js";
import { IconArrowUpRight, IconClose, IconMenu } from "./icons.jsx";

const MOBILE_QUERY = "(max-width:920px)";

export default function SiteHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  // Escape, a click outside the header, or growing past the mobile breakpoint closes the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const controller = new AbortController();
    const { signal } = controller;
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape") return;
        setMenuOpen(false);
        toggleRef.current?.focus();
      },
      { signal },
    );
    document.addEventListener(
      "click",
      (e) => {
        if (!e.target.closest("#site-header")) setMenuOpen(false);
      },
      { signal },
    );
    matchMedia(MOBILE_QUERY).addEventListener("change", () => setMenuOpen(false), {
      signal,
    });
    return () => controller.abort();
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header id="site-header" className="topnav">
      <div className="container topnav-inner">
        <Link to="/" className="logo" aria-label={t("nav.logoLabel")}>
          {t("nav.logo")}
        </Link>
        <nav
          id="navigation-links"
          aria-label={t("nav.label")}
          className={menuOpen ? "open" : undefined}
        >
          {NAV_ITEMS.map(({ path, labelKey }) => (
            <NavLink key={path} to={path} end={path === "/"} onClick={closeMenu}>
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
        <Link to="/contact" className="nav-contact">
          {t("nav.cta")} <IconArrowUpRight />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="navigation-links"
          ref={toggleRef}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <>
              {t("nav.close")} <IconClose />
            </>
          ) : (
            <>
              {t("nav.menu")} <IconMenu />
            </>
          )}
        </button>
      </div>
    </header>
  );
}
