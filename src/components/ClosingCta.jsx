import { Link } from "react-router";
import { useI18n } from "../i18n/useI18n.js";
import { IconArrowUpRight } from "./icons.jsx";

// Shared last section of inner pages: a nudge towards the contact page.
// `index` continues the page's section numbering ("06"); omit it on unnumbered pages.
export default function ClosingCta({ index }) {
  const { t } = useI18n();
  return (
    <section className="section closing">
      <div className="container row-between">
        <div>
          <p className="eyebrow">
            {index ? `${index} / ${t("common.nextStep")}` : t("common.nextStep")}
          </p>
          <h2>
            {t("home.contactTitle")}
            <br />
            <em>{t("home.contactTitleEm")}</em>
          </h2>
        </div>
        <Link to="/contact" className="circle-cta">
          <span>{t("home.contactCta")}</span>
          <IconArrowUpRight className="lucide" />
        </Link>
      </div>
    </section>
  );
}
