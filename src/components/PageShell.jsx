import { useI18n } from "../i18n/useI18n.js";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";

// Document chrome shared by every page. Each page brings its own stylesheet bundle, rendered
// in a fixed order; it is mounted and removed together with the page so rules
// from different pages never meet in one cascade.
export default function PageShell({
  title,
  description,
  themeColor,
  styles,
  progress = "reading-progress",
  children,
}) {
  const { t } = useI18n();
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description ?? t("meta.description")} />
      {themeColor && <meta name="theme-color" content={themeColor} />}
      {styles.map((css, i) => (
        <style key={i}>{css}</style>
      ))}
      <a className="skip" href="#content">
        {t("common.skip")}
      </a>
      <div className={progress} aria-hidden="true"></div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
