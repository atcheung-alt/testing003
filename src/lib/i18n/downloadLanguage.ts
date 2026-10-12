import type { NextRequest } from "next/server";
import { pdfDownloadLanguage, type PdfDownloadLanguage } from "@/lib/pdf/language";
import { LANGUAGE_COOKIE, appLanguageToPdf, parseAppLanguage, type AppLanguage } from "@/lib/i18n/language";

/** The visitor's Language choice. Defaults to English when they have not picked one. */
export function appLanguageFromRequest(request: NextRequest): AppLanguage {
  return parseAppLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value);
}

/**
 * Language for a generated PDF. An explicit `?lang=` still wins (shared links),
 * otherwise the file follows the Language button. Nothing is saved on the record.
 */
export function pdfLanguageFromRequest(request: NextRequest): PdfDownloadLanguage {
  return pdfDownloadLanguage(request.nextUrl.searchParams.get("lang")) ?? appLanguageToPdf(appLanguageFromRequest(request));
}
