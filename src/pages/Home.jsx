import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, MoveHorizontal, Pause, Play } from "lucide-react";
import Lines from "../components/Lines.jsx";
import PageShell from "../components/PageShell.jsx";
import { profile } from "../data/profile.js";
import avatar from "../assets/images/avatar.webp";
import { projects } from "../data/projects.js";
import { useI18n } from "../i18n/useI18n.js";
import { portfolioStyles } from "../styles/pageStyles.js";
import { mountHomeExperience } from "./home/experience.js";

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pauses the sculpture's idle motion.
function MotionToggle({ paused, onToggle, disabled }) {
  const { t } = useI18n();
  const Icon = paused ? Play : Pause;
  return (
    <button
      type="button"
      className="icon-button"
      id="motion-toggle"
      aria-label={paused ? t("home.resumeMotion") : t("home.pauseMotion")}
      aria-pressed={paused}
      disabled={disabled}
      onClick={onToggle}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}

function Hero({ paused, onToggleMotion, webglFailed }) {
  const { t, pick } = useI18n();
  const me = pick(profile.content);
  return (
    <section className="section hero gallery-hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-top">
          <span>{t("home.heroTop")}</span>
          <span className="hero-edition">{t("home.heroEdition")}</span>
        </div>
        <div className="gallery-stage">
          <div className="gallery-word" aria-hidden="true">
            {t("home.word")}
          </div>
          <div className="gallery-orbit" aria-hidden="true" />
          <div className="hero-visual">
            {webglFailed ? (
              <p>{t("home.webglFallback")}</p>
            ) : (
              <canvas id="sculpture" tabIndex={0} aria-label={t("home.sculptureLabel")} />
            )}
          </div>
          <div className="gallery-caption" aria-hidden="true">
            <span className="gallery-dot" />
            <span>
              {t("home.captionTitle")}
              <br />
              <span className="gallery-caption-sub">{t("home.captionSub")}</span>
            </span>
          </div>
          <div className="gallery-panels">
            <div className="gallery-panel">
              <p className="eyebrow">{t("home.eyebrow")}</p>
              <h1 id="hero-title">
                {t("home.heading")}
                <br />
                <em>{t("home.headingEm")}</em>
              </h1>
              <p className="gallery-lead">{me.intro}</p>
              <div className="hero-ctas">
                <Link className="gallery-link" to="/resume">
                  <span>{t("home.ctaResume")}</span>
                  <span className="gallery-arrow">
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
                <Link className="gallery-link" to="/projects">
                  <span>{t("home.ctaProjects")}</span>
                  <span className="gallery-arrow">
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <span className="gallery-vertical" aria-hidden="true">
            {t("home.vertical")}
          </span>
          <div className="gallery-interact" aria-hidden="true">
            <MoveHorizontal />
            <span>{t("home.interact")}</span>
          </div>
        </div>
        <div className="gallery-footer">
          <p>
            {t("home.footerLine")}
            <br />
            <span>{t("home.footerSub")}</span>
          </p>
          <div className="gallery-controls">
            <MotionToggle paused={paused} onToggle={onToggleMotion} disabled={webglFailed} />
          </div>
        </div>
        <p className="david-credit">
          {t("home.credit")}{" "}
          <a
            href="https://sketchfab.com/3d-models/head-of-michelangelos-david-optimised-d29af50360624e5e9b1855666475380d"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thomas Flynn / CC BY 4.0 <ArrowUpRight aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}

function Disciplines() {
  const { t } = useI18n();
  return (
    <div className="discipline-band" role="region" aria-label={t("home.disciplinesLabel")}>
      <ul className="discipline-list">
        {t("home.disciplines").map(({ title, caption }, i) => (
          <li className="discipline-item" key={title}>
            <span className="discipline-number" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="discipline-copy">
              <span className="discipline-title">{title}</span>
              <span className="discipline-caption">{caption}</span>
            </div>
            <ArrowUpRight className="discipline-arrow" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function About() {
  const { t } = useI18n();
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container grid-1-2 about-grid">
        <div>
          <p className="eyebrow">{t("home.aboutEyebrow")}</p>
          <h2 id="about-title">{t("home.aboutTitle")}</h2>
          <p className="principle">
            <Lines text={t("home.aboutPrinciple")} />
          </p>
        </div>
        <div>
          <p className="lead">{t("home.aboutLead")}</p>
          <div className="about-detail">
            <div className="discipline">
              {t("home.aboutRows").map(({ to, title, text }, i) => (
                <Link className="log-row" to={to} key={to}>
                  <span className="meta">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="pull">
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
            <img
              className="about-avatar"
              src={avatar}
              alt={t("home.avatarAlt")}
              width="600"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { t, pick } = useI18n();
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{t("home.workEyebrow")}</p>
          <h2 id="work-title">
            {t("home.workTitle")}
            <span className="muted-dot">.</span>
          </h2>
        </div>
        <div className="grid-2 works">
          {projects.map((project) => {
            const c = pick(project.content);
            return (
              <Link className="card-flat work-card" to="/projects" key={project.id}>
                <div className="work-image">
                  <img
                    src={project.thumbnail}
                    alt={c.thumbnailAlt}
                    width="800"
                    height="500"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="project-open" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="work-info">
                  <h3>{c.title}</h3>
                </div>
                <p className="work-sub">{c.summary}</p>
                <div className="work-detail" aria-hidden="true">
                  <span>{project.tags.slice(0, 4).join(" · ")}</span>
                  <ArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactTeaser() {
  const { t } = useI18n();
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="eyebrow">{t("home.contactEyebrow")}</p>
        <h2 id="contact-title">
          {t("home.contactTitle")}
          <br />
          <em>{t("home.contactTitleEm")}</em>
        </h2>
        <p className="lead">{t("home.contactLead")}</p>
        <Link className="btn btn-primary" to="/contact">
          {t("home.contactCta")} <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  const mainRef = useRef(null);
  const [paused, setPaused] = useState(prefersReducedMotion);
  // Shared with the sculpture's render loop, which reads .paused every frame.
  const motionRef = useRef({ paused });
  useEffect(() => {
    motionRef.current.paused = paused;
  }, [paused]);
  const [webglFailed, setWebglFailed] = useState(false);
  // Layout effect: soft-text splitting and GSAP "from" states apply before first paint.
  useLayoutEffect(
    () =>
      mountHomeExperience({
        root: mainRef.current,
        reduced: prefersReducedMotion(),
        motion: motionRef.current,
        onWebglError: () => setWebglFailed(true),
      }),
    [],
  );
  return (
    <PageShell
      title={t("home.title")}
      themeColor="rgb(247,249,251)"
      styles={portfolioStyles}
      progress="scroll-progress"
    >
      <main id="content" ref={mainRef}>
        <Hero
          paused={paused}
          onToggleMotion={() => setPaused((p) => !p)}
          webglFailed={webglFailed}
        />
        <Disciplines />
        <About />
        <SelectedWork />
        <ContactTeaser />
      </main>
    </PageShell>
  );
}
