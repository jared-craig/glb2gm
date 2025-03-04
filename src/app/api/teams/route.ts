import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const allTeamData = await prisma.ladder.findMany({
    where: {
      season: process.env.CURRENT_SEASON ? +process.env.CURRENT_SEASON : undefined,
    },
    orderBy: [
      {
        global_rank: 'asc',
      },
    ],
  });
  return Response.json(allTeamData);
}
