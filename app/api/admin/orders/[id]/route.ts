import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_auth")?.value;
    const session = verifyAdminSession(token);

    // Verificăm dacă userul este admin
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Ștergem mai întâi OrderItem-urile asociate (datorită foreign key constraint)
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Apoi ștergem comanda
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Comanda a fost ștearsă cu succes'
    });
  } catch (error: any) {
    console.error('[DELETE /api/admin/orders/[id]] Error:', error);
    return NextResponse.json({
      error: error?.message || 'Eroare la ștergerea comenzii'
    }, { status: 500 });
  }
}
