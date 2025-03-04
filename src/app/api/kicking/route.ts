import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tiers = params.get('tiers')?.split(',');
  const allPlayerKickingData = await prisma.kicking.findMany({
    where: {
      tier: tiers !== null ? { in: tiers } : undefined,
      season: process.env.CURRENT_SEASON ? +process.env.CURRENT_SEASON : undefined,
    },
    orderBy: [
      {
        fg_made: 'desc',
      },
      {
        fg_attempts: 'desc',
      },
    ],
  });
  return Response.json(allPlayerKickingData);
}
