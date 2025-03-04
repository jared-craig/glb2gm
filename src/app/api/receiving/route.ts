import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const positions = params.get('positions')?.split(',');
  const tiers = params.get('tiers')?.split(',');
  const allPlayerReceivingData = await prisma.receiving.findMany({
    where: {
      position: positions !== null ? { in: positions } : undefined,
      tier: tiers !== null ? { in: tiers } : undefined,
      season: process.env.CURRENT_SEASON ? +process.env.CURRENT_SEASON : undefined,
    },
    orderBy: [
      {
        yards: 'desc',
      },
      {
        average: 'desc',
      },
    ],
  });
  return Response.json(allPlayerReceivingData);
}
