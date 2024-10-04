import { TeamBuilderTeam } from '@/app/team-builder/teamBuilderTeam';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user?.email) return Response.error();
    const allTeamBuilderData = await prisma.teamBuilderTeams.findMany({
      where: {
        user_email: user?.email ?? undefined,
      },
      include: {
        TeamBuilderPlayers: true,
      },
    });
    return Response.json(allTeamBuilderData.map((x) => ({ ...x, players: x.TeamBuilderPlayers })));
  } catch (error) {
    return Response.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const reqData: TeamBuilderTeam = await req.json();
    await prisma.teamBuilderTeams.create({
      data: {
        id: reqData.id,
        user_email: reqData.user_email,
        team_name: reqData.team_name,
        TeamBuilderPlayers: {
          create: reqData.players,
        },
      },
    });
    return new Response(null, { status: 201 });
  } catch (error) {
    throw error;
  }
}

export async function PUT(req: Request) {
  try {
    const reqData: TeamBuilderTeam = await req.json();
    await prisma.teamBuilderPlayers.deleteMany({
      where: {
        team_id: reqData.id,
      },
    });
    await prisma.teamBuilderTeams.update({
      where: {
        id: reqData.id,
      },
      data: {
        user_email: reqData.user_email,
        team_name: reqData.team_name,
        TeamBuilderPlayers: {
          create: reqData.players,
        },
      },
    });
    return new Response(null, { status: 201 });
  } catch (error) {
    throw error;
  }
}

export async function DELETE(req: Request) {
  try {
    const reqData = await req.json();
    const deletePlayers = prisma.teamBuilderPlayers.deleteMany({
      where: {
        team_id: reqData.id,
      },
    });
    const deleteTeam = prisma.teamBuilderTeams.delete({
      where: {
        id: reqData.id,
      },
    });
    const transaction = await prisma.$transaction([deletePlayers, deleteTeam]);
    return new Response(null, { status: 200 });
  } catch (error) {
    throw error;
  }
}
