import Link from "next/link";
import { FileText, ReceiptText, Wallet, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { getInvoiceDisplayStatus, isOverdueInvoice } from "@/lib/invoiceStatus";
import { getCurrentMonthFinance } from "@/lib/finance";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const t = getT();
  const [quotations, invoices, recentQuotations, recentInvoices, thisMonth] =
    await Promise.all([
      prisma.quotation.findMany({ select: { status: true, total: true } }),
      prisma.invoice.findMany({ select: { status: true, total: true, dueDate: true } }),
      prisma.quotation.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      getCurrentMonthFinance(),
    ]);

  const outstanding = invoices
    .filter(
      (i) =>
        i.status === "UNPAID" || i.status === "OVERDUE" || i.status === "PENDING_VERIFICATION"
    )
    .reduce((sum, i) => sum + i.total, 0);
  const quotedValue = quotations
    .filter((q) => q.status === "SENT" || q.status === "DRAFT")
    .reduce((sum, q) => sum + q.total, 0);

  const overdueInvoices = invoices.filter(isOverdueInvoice);
  const overdueCount = overdueInvoices.length;
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">{t("Dashboard")}</h1>
        <p className="text-sm text-ink-muted">
          {t("A quick look at your pipeline of quotations and invoices.")}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold">{t("This month")}</h2>
          <Link
            href="/analysis"
            className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1"
          >
            {t("Full analysis")} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label={t("Revenue")}
            value={formatCurrency(thisMonth.revenue)}
            icon={TrendingUp}
            accent="brand"
          />
          <StatCard
            label={t("Expenses")}
            value={formatCurrency(thisMonth.expenses)}
            icon={TrendingDown}
            accent="danger"
          />
          <StatCard
            label={t("Net profit")}
            value={formatCurrency(thisMonth.profit)}
            icon={PiggyBank}
            accent={thisMonth.profit < 0 ? "danger" : "accent"}
          />
        </div>
        <p className="text-xs text-ink-faint mt-2">
          {t("Based on invoices paid this calendar month, minus their logged expenses.")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label={t("Quotations")} value={String(quotations.length)} icon={FileText} />
          <StatCard label={t("Invoices")} value={String(invoices.length)} icon={ReceiptText} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label={t("Outstanding")}
            value={formatCurrency(outstanding)}
            icon={Wallet}
            accent="accent"
          />
          <StatCard
            label={t("Overdue")}
            value={formatCurrency(overdueAmount)}
            icon={AlertTriangle}
            accent="danger"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">{t("Recent quotations")}</h2>
            <Link
              href="/quotations"
              className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1"
            >
              {t("View all")} <ArrowRight size={14} />
            </Link>
          </div>
          {recentQuotations.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t("No quotations yet")}
              description={t("Create your first quotation to start quoting customers for work.")}
              actionHref="/quotations/new"
              actionLabel={t("New quotation")}
            />
          ) : (
            <div className="card divide-y divide-line">
              {recentQuotations.map((q) => (
                <Link
                  key={q.id}
                  href={`/quotations/${q.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-paper transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-ink">{q.number}</p>
                    <p className="text-xs text-ink-muted">
                      {q.customerName} · {formatDate(q.issueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{formatCurrency(q.total)}</span>
                    <StatusBadge status={q.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">{t("Recent invoices")}</h2>
            <Link
              href="/invoices"
              className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1"
            >
              {t("View all")} <ArrowRight size={14} />
            </Link>
          </div>
          {recentInvoices.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title={t("No invoices yet")}
              description={t("Convert an accepted quotation, or create an invoice directly.")}
              actionHref="/invoices/new"
              actionLabel={t("New invoice")}
            />
          ) : (
            <div className="card divide-y divide-line">
              {recentInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-paper transition-colors"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-ink">{inv.number}</p>
                    <p className="text-xs text-ink-muted">
                      {inv.customerName} · {formatDate(inv.issueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{formatCurrency(inv.total)}</span>
                    <StatusBadge status={getInvoiceDisplayStatus(inv)} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {(quotedValue > 0 || overdueCount > 0) && (
        <div className="flex flex-col gap-1">
          {overdueCount > 0 && (
            <p className="text-xs text-danger-500">
              {overdueCount === 1
                ? t("{count} invoice overdue, totalling {amount}.", {
                    count: overdueCount,
                    amount: formatCurrency(overdueAmount),
                  })
                : t("{count} invoices overdue, totalling {amount}.", {
                    count: overdueCount,
                    amount: formatCurrency(overdueAmount),
                  })}
            </p>
          )}
          {quotedValue > 0 && (
            <p className="text-xs text-ink-muted">
              {t("{amount} in open quotations awaiting a response.", {
                amount: formatCurrency(quotedValue),
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
