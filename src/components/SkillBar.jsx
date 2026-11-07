import { SKILL_LEVEL_MAX } from "../data/skills.js";
import { useI18n } from "../i18n/useI18n.js";

// One skill: name, level label and a segmented bar exposed to assistive tech as a meter.
export default function SkillBar({ name, level }) {
  const { t } = useI18n();
  const label = t("skills.levels")[level - 1];
  return (
    <li className="skill">
      <div className="skill-head">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{label}</span>
      </div>
      <div
        className="skill-bar"
        style={{ "--segments": SKILL_LEVEL_MAX }}
        role="meter"
        aria-label={name}
        aria-valuemin={1}
        aria-valuemax={SKILL_LEVEL_MAX}
        aria-valuenow={level}
        aria-valuetext={`${label} — ${t("skills.levelLabel", { level, max: SKILL_LEVEL_MAX })}`}
      >
        {Array.from({ length: SKILL_LEVEL_MAX }, (_, i) => (
          <span key={i} className={i < level ? "is-on" : undefined} />
        ))}
      </div>
    </li>
  );
}
