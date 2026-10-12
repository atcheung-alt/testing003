"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft } from "lucide-react";
import { useT } from "@/lib/i18n/client";

export default function ConvertToInvoiceButton({ quotationId }: { quotationId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  async function handleConvert() {
    if (!window.confirm(t("Convert this quotation into an invoice? The quotation will be locked."))) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("Could not convert quotation."));
      router.push(`/invoices/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={handleConvert} disabled={busy} className="btn-primary">
        <ArrowRightLeft size={15} /> {busy ? t("Converting…") : t("Convert to invoice")}
      </button>
      {error && <span className="text-xs text-danger-500">{error}</span>}
    </div>
  );
}
