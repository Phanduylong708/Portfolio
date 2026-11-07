import { Link } from "react-router";
import { useI18n } from "../i18n/useI18n.js";

// Opening block of every inner page: breadcrumb, two-line heading and a short lead.
// `action` (optional) sits at the right end of the lead row.
export default function PageHero({ crumb, heading, headingEm, lead, action }) {
  const { t } = useI18n();
  return (
    <section className="section inner-hero">
      <div className="container">
        <nav className="breadcrumb" aria-label={t("common.breadcrumb")}>
          <Link to="/">{t("common.home")}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <h1>
          {heading}
          <br />
          <em>{headingEm}</em>
        </h1>
        <div className="hero-summary">
          <span className="hero-mark" aria-hidden="true">
            ✳
          </span>
          <p className="lead">{lead}</p>
          {action}
        </div>
      </div>
    </section>
  );
}
