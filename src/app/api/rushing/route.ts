import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const allPlayerRushingData = await prisma.rushing.findMany();
  return Response.json(allPlayerRushingData);
}
