import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const teamId = +(params.get('teamId') ?? -1);
  if (teamId !== -1) {
    return Response.json(
      await prisma.games.findMany({
        where: {
          OR: [{ team_one_id: teamId }, { team_two_id: teamId }],
        },
      })
    );
  } else {
    return Response.json(await prisma.games.findMany());
  }
}
