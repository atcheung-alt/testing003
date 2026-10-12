import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildQuotationPdf } from "@/lib/pdf/build";
import { pdfContentDisposition } from "@/lib/pdf/language";
import { pdfLanguageFromRequest } from "@/lib/i18n/downloadLanguage";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const language = pdfLanguageFromRequest(request);
  const quotation = await prisma.quotation.findUnique({
    where: { signingToken: params.token },
    select: { id: true, number: true },
  });
  if (!quotation) {
    return NextResponse.json({ error: "This signing link is invalid or has expired." }, { status: 404 });
  }

  const built = await buildQuotationPdf(quotation.id, language);
  if (!built) {
    return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(built.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": pdfContentDisposition(`${built.number}.pdf`, language),
    },
  });
}
