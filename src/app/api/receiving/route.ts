import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const allPlayerReceivingData = await prisma.receiving.findMany({
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
