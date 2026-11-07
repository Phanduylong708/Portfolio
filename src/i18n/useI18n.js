import { createContext, useContext } from "react";

export const DEFAULT_LOCALE = "en";
export const I18nContext = createContext(null);

/** @returns {{ locale: string, t: (key: string, vars?: object) => any, pick: (localized: object) => any }} */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
