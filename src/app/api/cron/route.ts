import { truncateTable, writePassingDataToDb, writeRushingDataToDb } from '@/app/scrape/database/database';
import { PlayerPassingData, PlayerRushingData } from '@/app/scrape/interfaces';
import { getPlayerPassingData } from '@/app/scrape/scraping/getPlayerPassingData';
import { getPlayerRushingData } from '@/app/scrape/scraping/getPlayerRushingData';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const season = '77';
  const shouldTruncate = true;
  const passingTable = 'PassingTest';
  const rushingTable = 'RushingTest';

  // Passing
  const qbPassingRookieData: PlayerPassingData[] = await getPlayerPassingData(season, 'Rookie', 10);

  const qbPassingSophomoreData: PlayerPassingData[] = await getPlayerPassingData(season, 'Sophomore', 10);

  const qbPassingProfessionalData: PlayerPassingData[] = await getPlayerPassingData(season, 'Professional', 10);

  const qbPassingVeteranData: PlayerPassingData[] = await getPlayerPassingData(season, 'Veteran', 10);

  // Rushing
  const qbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'QB', 10);
  const hbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'HB', 10);
  const fbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'FB', 10);

  const qbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'QB', 10);
  const hbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'HB', 10);
  const fbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'FB', 10);

  const qbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'QB', 10);
  const hbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'HB', 10);
  const fbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'FB', 10);

  const qbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'QB', 10);
  const hbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'HB', 10);
  const fbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'FB', 10);

  if (shouldTruncate) {
    await truncateTable(passingTable);
    await truncateTable(rushingTable);
  }

  // Passing
  if (qbPassingRookieData.length > 0) await writePassingDataToDb(qbPassingRookieData, passingTable);

  if (qbPassingSophomoreData.length > 0) await writePassingDataToDb(qbPassingSophomoreData, passingTable);

  if (qbPassingProfessionalData.length > 0) await writePassingDataToDb(qbPassingProfessionalData, passingTable);

  if (qbPassingVeteranData.length > 0) await writePassingDataToDb(qbPassingVeteranData, passingTable);

  // Rushing
  if (qbPlayerRushingRookieData.length > 0) await writeRushingDataToDb(qbPlayerRushingRookieData, rushingTable);
  if (hbPlayerRushingRookieData.length > 0) await writeRushingDataToDb(hbPlayerRushingRookieData, rushingTable);
  if (fbPlayerRushingRookieData.length > 0) await writeRushingDataToDb(fbPlayerRushingRookieData, rushingTable);

  if (qbPlayerRushingSophomoreData.length > 0) await writeRushingDataToDb(qbPlayerRushingSophomoreData, rushingTable);
  if (hbPlayerRushingSophomoreData.length > 0) await writeRushingDataToDb(hbPlayerRushingSophomoreData, rushingTable);
  if (fbPlayerRushingSophomoreData.length > 0) await writeRushingDataToDb(fbPlayerRushingSophomoreData, rushingTable);

  if (qbPlayerRushingProfessionalData.length > 0) await writeRushingDataToDb(qbPlayerRushingProfessionalData, rushingTable);
  if (hbPlayerRushingProfessionalData.length > 0) await writeRushingDataToDb(hbPlayerRushingProfessionalData, rushingTable);
  if (fbPlayerRushingProfessionalData.length > 0) await writeRushingDataToDb(fbPlayerRushingProfessionalData, rushingTable);

  if (qbPlayerRushingVeteranData.length > 0) await writeRushingDataToDb(qbPlayerRushingVeteranData, rushingTable);
  if (hbPlayerRushingVeteranData.length > 0) await writeRushingDataToDb(hbPlayerRushingVeteranData, rushingTable);
  if (fbPlayerRushingVeteranData.length > 0) await writeRushingDataToDb(fbPlayerRushingVeteranData, rushingTable);

  return Response.json({ ok: true });
}
