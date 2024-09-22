import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const teamId = +(params.get('teamId') ?? 0);
  const allGameData = await prisma.games.findMany({
    where: {
      OR: [{ team_one_id: teamId }, { team_two_id: teamId }],
    },
  });
  return Response.json(allGameData);
}
