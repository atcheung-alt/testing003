import { NextRequest, NextResponse } from "next/server";
import { getFinanceByPeriod, getAccountsReceivable, type FinanceGranularity } from "@/lib/finance";
import { formatCurrency } from "@/lib/calculations";
import { buildCsv, csvResponseHeaders } from "@/lib/csv";
import { appLanguageFromRequest } from "@/lib/i18n/downloadLanguage";
import { translate } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

const VALID_GRANULARITIES: FinanceGranularity[] = ["week", "month", "year"];

function parseGranularity(value: string | null): FinanceGranularity {
  return VALID_GRANULARITIES.includes(value as FinanceGranularity) ? (value as FinanceGranularity) : "month";
}

function parseRefDate(value: string | null): Date {
  if (value) {
    const parsed = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export async function GET(request: NextRequest) {
  const language = appLanguageFromRequest(request);
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
  const granularity = parseGranularity(request.nextUrl.searchParams.get("granularity"));
  const refDate = parseRefDate(request.nextUrl.searchParams.get("ref"));
  const locale = language === "zh" ? "zh-HK" : "en-US";

  const { buckets, rangeLabel } = await getFinanceByPeriod(granularity, refDate, locale);
  const ar = await getAccountsReceivable();

  const totalRevenue = buckets.reduce((sum, b) => sum + b.revenue, 0);
  const totalExpenses = buckets.reduce((sum, b) => sum + b.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  const periodHeader = granularity === "year" ? t("Month") : t("Day");
  const rows = buckets.map((b) => [
    b.label,
    b.revenue.toFixed(2),
    b.expenses.toFixed(2),
    b.profit.toFixed(2),
  ]);

  rows.push(["", "", "", ""]);
  rows.push([t("Summary for {label}", { label: rangeLabel }), "", "", ""]);
  rows.push([t("Total Revenue"), formatCurrency(totalRevenue), "", ""]);
  rows.push([t("Total Expenses"), formatCurrency(totalExpenses), "", ""]);
  rows.push([t("Net Profit"), formatCurrency(totalProfit), "", ""]);
  rows.push([t("Outstanding (as of today)"), formatCurrency(ar.total), "", ""]);

  const csv = buildCsv([periodHeader, t("Revenue"), t("Expenses"), t("Net Profit")], rows);
  const body = language === "zh" ? `\uFEFF${csv}` : csv;

  return new NextResponse(body, {
    headers: csvResponseHeaders(`analysis-${granularity}-${refDate.toISOString().slice(0, 10)}.csv`),
  });
}
