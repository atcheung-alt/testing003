import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildReceiptPdf } from "@/lib/pdf/build";
import { pdfContentDisposition } from "@/lib/pdf/language";
import { pdfLanguageFromRequest } from "@/lib/i18n/downloadLanguage";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const language = pdfLanguageFromRequest(request);
  const receipt = await prisma.receipt.findUnique({
    where: { id: params.id },
    select: { invoiceId: true },
  });
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }

  const built = await buildReceiptPdf(receipt.invoiceId, language);
  if (!built) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(built.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": pdfContentDisposition(`${built.number}.pdf`, language),
    },
  });
}
