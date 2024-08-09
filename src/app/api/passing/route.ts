import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const allPlayerPassingData = await prisma.passing.findMany({
    orderBy: [
      {
        yards_per_attempt: 'desc',
      },
      {
        yards: 'desc',
      },
    ],
  });
  return Response.json(allPlayerPassingData);
}
