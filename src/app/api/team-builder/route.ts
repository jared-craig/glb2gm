import { auth0 } from '@/app/lib/auth0';
import { TeamBuilderTeam } from '@/app/team-builder/teamBuilderTeam';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth0.getSession();
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
  } catch {
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
          create: reqData.players.map((x) => ({
            id: x.id,
            player_name: x.player_name,
            position: x.position,
            contract: x.contract,
            trait1: x.trait1,
            trait2: x.trait2,
            trait3: x.trait3,
            salary: x.salary,
            is_new: x.is_new,
            order_index: x.order_index,
            build_json: x.build_json,
          })),
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
          create: reqData.players.map((x) => ({
            id: x.id,
            player_name: x.player_name,
            position: x.position,
            contract: x.contract,
            trait1: x.trait1,
            trait2: x.trait2,
            trait3: x.trait3,
            salary: x.salary,
            is_new: x.is_new,
            order_index: x.order_index,
            build_json: x.build_json,
          })),
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
    await prisma.$transaction([deletePlayers, deleteTeam]);
    return new Response(null, { status: 200 });
  } catch (error) {
    throw error;
  }
}
