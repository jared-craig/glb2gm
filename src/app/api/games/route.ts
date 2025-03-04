import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const teamId = params.get('teamId');
  const gameData = await prisma.games.findMany({
    where: {
      season: process.env.CURRENT_SEASON ? +process.env.CURRENT_SEASON : undefined,
      OR: teamId !== null ? [{ team_one_id: +teamId }, { team_two_id: +teamId }] : undefined,
    },
  });
  return Response.json(gameData);
}
