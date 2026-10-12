import ClientsManager from "@/components/ClientsManager";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  const t = getT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">{t("Clients")}</h1>
        <p className="text-sm text-ink-muted">
          {t(
            "Your client library — companies and individuals you've worked with. Quotations and invoices still store their own customer details independently, so editing a client here never changes an already-created document."
          )}
        </p>
      </div>
      <ClientsManager />
    </div>
  );
}
