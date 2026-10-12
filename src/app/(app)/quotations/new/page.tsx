import QuotationForm from "@/components/QuotationForm";
import { getT } from "@/lib/i18n/server";

export default function NewQuotationPage() {
  const t = getT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">{t("New quotation")}</h1>
        <p className="text-sm text-ink-muted">
          {t(
            "Enter the customer details, add line items, and HR Plus will calculate totals automatically."
          )}
        </p>
      </div>
      <QuotationForm />
    </div>
  );
}
