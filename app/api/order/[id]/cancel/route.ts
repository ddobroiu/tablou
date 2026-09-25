
import type { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/adminSession";
import { prisma } from "@/lib/prisma";

// Doar adminul poate schimba starea unei comenzi (cookie admin_auth)
const isAdmin = (req: NextRequest) => Boolean(verifyAdminSession(req.cookies.get("admin_auth")?.value));

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) return new Response("Unauthorized", { status: 401 });
  const params = await context.params;
  const orderId = params.id;
  const result = await prisma
    .order.update({ where: { id: orderId }, data: { status: "canceled", canceledAt: new Date() } })
    .catch(() => null);
  if (result) {
    return new Response("Comanda anulată", { status: 200 });
  }
  return new Response("Eroare la anulare", { status: 500 });
}
