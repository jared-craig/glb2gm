import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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
