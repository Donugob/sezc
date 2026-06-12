import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const tierSchema = z.object({
  name:        z.string().min(1),
  description: z.string().min(1),
  price:       z.number().int().positive(),
  capacity:    z.number().int().positive().nullable(),
  perks:       z.array(z.string()),
  isOpen:      z.boolean(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = tierSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const tier = await prisma.ticketTier.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ tier });
  } catch {
    return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const hasRegistrations = await prisma.registration.count({ where: { ticketTierId: id } });
    if (hasRegistrations > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a tier with existing registrations.' },
        { status: 400 }
      );
    }
    await prisma.ticketTier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete tier' }, { status: 500 });
  }
}
