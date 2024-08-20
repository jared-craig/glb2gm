import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const positions = params.get('positions')?.split(',');
  const tiers = params.get('tiers')?.split(',');
  const allPlayerBlockingData = await prisma.blocking.findMany({
    where: {
      position: positions !== null ? { in: positions } : undefined,
      tier: tiers !== null ? { in: tiers } : undefined,
    },
    orderBy: [
      {
        pancakes: 'desc',
      },
      {
        sacks_allowed: 'asc',
      },
    ],
  });
  return Response.json(allPlayerBlockingData);
}
