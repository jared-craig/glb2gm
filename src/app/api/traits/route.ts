import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const traitData = await prisma.traits.findMany();
    return Response.json(traitData);
  } catch (error) {
    return Response.json([]);
  }
}
