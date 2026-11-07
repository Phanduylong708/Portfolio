import { useMemo, useState } from "react";

export const ALL_TAGS = "all";

const normalize = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Tag filter and name search, combined: a project must match both.
export function useProjectFilter(projects, getTitle) {
  const [tag, setTag] = useState(ALL_TAGS);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query);
    return projects.filter(
      (p) =>
        (tag === ALL_TAGS || p.tags.includes(tag)) &&
        (!q || normalize(getTitle(p)).includes(q)),
    );
  }, [projects, getTitle, tag, query]);

  const reset = () => {
    setTag(ALL_TAGS);
    setQuery("");
  };

  return { tag, setTag, query, setQuery, results, reset };
}
