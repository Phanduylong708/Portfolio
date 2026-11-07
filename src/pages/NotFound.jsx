import { Link } from "react-router";
import PageShell from "../components/PageShell.jsx";
import { IconArrowUpRight } from "../components/icons.jsx";
import { NAV_ITEMS } from "../data/navigation.js";
import { useInnerPageMotion } from "../hooks/useInnerPageMotion.js";
import { useI18n } from "../i18n/useI18n.js";
import { notFoundStyles } from "../styles/pageStyles.js";

export default function NotFound() {
  useInnerPageMotion();
  const { t } = useI18n();
  return (
    <PageShell title={t("notFound.title")} styles={notFoundStyles}>
      <main id="content">
        <section className="section inner-hero error-hero">
          <div className="container">
            <nav className="breadcrumb" aria-label={t("common.breadcrumb")}>
              <Link to="/">{t("common.home")}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t("notFound.crumb")}</span>
            </nav>
            <div className="error-number" aria-hidden="true">
              404
            </div>
            <h1>
              {t("notFound.heading")}
              <br />
              <em>{t("notFound.headingEm")}</em>
            </h1>
            <p className="lead">{t("notFound.lead")}</p>
            <div className="error-actions">
              <Link to="/" className="btn btn-primary">
                <span>{t("notFound.back")}</span>
                <IconArrowUpRight className="lucide" />
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container grid-1-2 body-grid">
            <div className="aside-title">
              <span>{t("notFound.elsewhere")}</span>
              <h2>{t("notFound.elsewhereTitle")}</h2>
            </div>
            <div className="index-grid">
              {NAV_ITEMS.filter(({ path }) => path !== "/").map(({ path, labelKey }) => (
                <Link key={path} to={path} className="text-link">
                  <span>{t(labelKey)}</span>
                  <IconArrowUpRight className="lucide" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
