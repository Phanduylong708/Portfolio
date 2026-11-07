import { useEffect, useRef } from "react";
import PageHero from "../components/PageHero.jsx";
import PageShell from "../components/PageShell.jsx";
import Lines from "../components/Lines.jsx";
import { IconArrowRight, IconArrowUpRight, IconCircleCheck } from "../components/icons.jsx";
import { profile } from "../data/profile.js";
import { useContactForm } from "../hooks/useContactForm.js";
import { useInnerPageMotion } from "../hooks/useInnerPageMotion.js";
import { useI18n } from "../i18n/useI18n.js";
import { innerStyles } from "../styles/pageStyles.js";

const FIELDS = [
  { name: "name", type: "text", autoComplete: "name", maxLength: 100 },
  { name: "email", type: "email", autoComplete: "email", maxLength: 200 },
  { name: "subject", type: "text", autoComplete: "off", maxLength: 150 },
  { name: "message", multiline: true, maxLength: 5000 },
];

function ContactChannels() {
  const { t } = useI18n();
  const { contacts } = profile;
  const channels = [
    { key: "email", value: contacts.email, href: `mailto:${contacts.email}` },
    { key: "phone", value: contacts.phone, href: contacts.phoneHref },
    { key: "linkedin", value: "phan-duy-long", href: contacts.linkedin, external: true },
    { key: "github", value: "Phanduylong708", href: contacts.github, external: true },
  ];
  return (
    <ul className="channel-list">
      {channels.map(({ key, value, href, external }) => (
        <li key={key}>
          <span className="meta">{t(`footer.${key}`)}</span>
          <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
            {value} <IconArrowUpRight className="lucide" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Contact() {
  useInnerPageMotion();
  const { t } = useI18n();
  const form = useContactForm();
  const formRef = useRef(null);
  const successRef = useRef(null);
  const submitting = form.status === "submitting";

  useEffect(() => {
    if (form.status === "success") successRef.current?.focus();
  }, [form.status]);

  const onSubmit = (e) => {
    e.preventDefault();
    const invalid = form.submit();
    if (invalid) formRef.current.elements[invalid].focus();
  };

  const errorText = (field) => {
    const err = form.errors[field];
    return err && t(`contact.errors.${err.key}`, err.vars);
  };

  return (
    <PageShell title={t("contact.title")} styles={innerStyles}>
      <main id="content">
        <PageHero
          crumb={t("nav.contact")}
          heading={t("contact.heading")}
          headingEm={t("contact.headingEm")}
          lead={t("contact.lead")}
        />
        <section className="section" aria-label={t("nav.contact")}>
          <div className="container grid-2 contact-grid">
            <aside className="contact-aside">
              <span className="meta">{t("contact.asideMeta")}</span>
              <h2>
                <Lines text={t("contact.asideTitle")} />
              </h2>
              <p>{t("contact.asideText")}</p>
              <ContactChannels />
            </aside>

            {form.status === "success" ? (
              <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
                <IconCircleCheck className="lucide" />
                <h2>{t("contact.successTitle")}</h2>
                <p>{t("contact.successText", { name: form.submittedName })}</p>
                <button type="button" className="btn btn-secondary" onClick={form.startOver}>
                  {t("contact.another")}
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                aria-busy={submitting}
              >
                {FIELDS.map(({ name, multiline, ...attrs }) => {
                  const error = errorText(name);
                  const errorId = `${name}-error`;
                  const Control = multiline ? "textarea" : "input";
                  return (
                    <div className={`field${error ? " has-error" : ""}`} key={name}>
                      <label htmlFor={name}>
                        {t(`contact.${name}`)} <span aria-hidden="true">*</span>
                        <span className="sr-only"> ({t("contact.required")})</span>
                      </label>
                      <Control
                        className={multiline ? "textarea" : "input"}
                        id={name}
                        name={name}
                        value={form.values[name]}
                        onChange={form.onChange}
                        onBlur={form.onBlur}
                        disabled={submitting}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : undefined}
                        aria-required="true"
                        {...attrs}
                      />
                      {error && (
                        <p className="field-error" id={errorId}>
                          {error}
                        </p>
                      )}
                    </div>
                  );
                })}
                <p className="form-note">{t("contact.formNote")}</p>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      <span>{t("contact.sending")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("contact.submit")}</span>
                      <IconArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
