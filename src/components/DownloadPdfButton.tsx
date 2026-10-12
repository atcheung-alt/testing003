"use client";

import { Download } from "lucide-react";
import { appendPdfLanguage } from "@/lib/pdf/language";
import { useAppLanguage, useT } from "@/lib/i18n/client";
import { appLanguageToPdf } from "@/lib/i18n/language";

/** One download. The file language follows the Language button and is not saved on the document. */
export default function DownloadPdfButton({ url }: { url: string }) {
  const language = useAppLanguage();
  const t = useT();
  return (
    <a
      href={appendPdfLanguage(url, appLanguageToPdf(language))}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary whitespace-nowrap shrink-0"
    >
      <Download size={15} /> {t("Download PDF")}
    </a>
  );
}
