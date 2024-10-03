import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tiers = params.get('tiers')?.split(',');
  const allPlayerPuntingData = await prisma.punting.findMany({
    where: {
      tier: tiers !== null ? { in: tiers } : undefined,
    },
    orderBy: [
      {
        average: 'desc',
      },
      {
        punts: 'desc',
      },
    ],
  });
  return Response.json(allPlayerPuntingData);
}
