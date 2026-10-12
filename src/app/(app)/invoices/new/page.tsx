import InvoiceForm from "@/components/InvoiceForm";
import { getT } from "@/lib/i18n/server";

export default function NewInvoicePage() {
  const t = getT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">{t("New invoice")}</h1>
        <p className="text-sm text-ink-muted">
          {t("Create an invoice directly, or convert an accepted quotation instead.")}
        </p>
      </div>
      <InvoiceForm />
    </div>
  );
}
