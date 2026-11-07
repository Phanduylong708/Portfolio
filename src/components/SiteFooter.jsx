import { Link } from "react-router";
import { NAV_ITEMS } from "../data/navigation.js";
import { profile } from "../data/profile.js";
import { useI18n } from "../i18n/useI18n.js";
import { IconArrowUp, IconArrowUpRight } from "./icons.jsx";
import Lines from "./Lines.jsx";

function backToTop(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}

export default function SiteFooter() {
  const { t } = useI18n();
  const { contacts } = profile;
  const channels = [
    { key: "email", href: `mailto:${contacts.email}` },
    { key: "phone", href: contacts.phoneHref },
    { key: "linkedin", href: contacts.linkedin, external: true },
    { key: "github", href: contacts.github, external: true },
  ];

  return (
    <footer className="pagefoot studio-footer">
      <div className="container">
        <div className="sf-top">
          <div className="sf-intro">
            <p className="sf-kicker">{t("footer.kicker")}</p>
            <h2>
              <Lines text={t("footer.title")} />
            </h2>
            <p>{t("footer.lead")}</p>
            <Link to="/contact">
              <span>{t("footer.cta")}</span>
              <IconArrowUpRight />
            </Link>
          </div>
          <div className="sf-navigation">
            <nav className="sf-column" aria-label={t("footer.pagesLabel")}>
              <p className="sf-kicker">{t("footer.pages")}</p>
              {NAV_ITEMS.map(({ path, labelKey }) => (
                <Link key={path} to={path}>
                  <span>{t(labelKey)}</span>
                  <IconArrowUpRight />
                </Link>
              ))}
            </nav>
            <nav className="sf-column" aria-label={t("footer.elsewhereLabel")}>
              <p className="sf-kicker">{t("footer.elsewhere")}</p>
              {channels.map(({ key, href, external }) => (
                <a
                  key={key}
                  href={href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span>{t(`footer.${key}`)}</span>
                  <IconArrowUpRight />
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="sf-bottom">
          <span>{t("footer.copyright")}</span>
          <span className="sf-signature">{t("footer.signature")}</span>
          <a href="#content" className="sf-back" onClick={backToTop}>
            {t("footer.backToTop")} <IconArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
