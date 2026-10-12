import type { AppLanguage } from "@/lib/i18n/language";
import { ZH } from "@/lib/i18n/zh";
import { PAGE_MESSAGES } from "@/lib/i18n/messages/pages";
import { COMPONENT_MESSAGES } from "@/lib/i18n/messages/components";
import { PUBLIC_MESSAGES } from "@/lib/i18n/messages/public";

const MESSAGES: Record<string, string> = {
  ...ZH,
  ...PAGE_MESSAGES,
  ...COMPONENT_MESSAGES,
  ...PUBLIC_MESSAGES,
};

export type TranslateVars = Record<string, string | number>;
export type TFunction = (key: string, vars?: TranslateVars) => string;

export function translate(language: AppLanguage, key: string, vars?: TranslateVars): string {
  const template = language === "zh" ? MESSAGES[key] ?? key : key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined || vars[name] === null ? "" : String(vars[name])
  );
}

export function makeT(language: AppLanguage): TFunction {
  return (key, vars) => translate(language, key, vars);
}
