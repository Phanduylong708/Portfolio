import { useMemo } from "react";
import en from "./en.js";
import { DEFAULT_LOCALE, I18nContext } from "./useI18n.js";

const dictionaries = { en };
// Resolve "nav.home" against the active dictionary; a missing key renders as the key itself
// so gaps are visible instead of silently empty. "{name}" placeholders take values from vars.
function lookup(dict, key, vars) {
  const value = key
    .split(".")
    .reduce((node, part) => (node == null ? node : node[part]), dict);
  if (value == null) return key;
  if (typeof value !== "string" || !vars) return value;
  return value.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
}

export function I18nProvider({ locale = DEFAULT_LOCALE, children }) {
  const value = useMemo(() => {
    const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
    return {
      locale,
      t: (key, vars) => lookup(dict, key, vars),
      // Data files keep their prose under per-locale keys: { en: {...}, vi: {...} }.
      pick: (localized) => localized[locale] ?? localized[DEFAULT_LOCALE],
    };
  }, [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
