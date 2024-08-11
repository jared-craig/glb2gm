import { truncateTable, writePassingDataToDb, writeRushingDataToDb } from '@/app/scrape/database/database';
import { PlayerPassingData, PlayerRushingData } from '@/app/scrape/interfaces';
import { getPlayerPassingData } from '@/app/scrape/scraping/getPlayerPassingData';
import { getPlayerRushingData } from '@/app/scrape/scraping/getPlayerRushingData';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      const season = '77';
      const shouldTruncate = true;
      const passingTable = 'Passing';
      const rushingTable = 'Rushing';

      // Passing
      // Rookie
      controller.enqueue(encoder.encode(`Scraping season ${season} Rookie QB passing player data...`));
      const qbPassingRookieData: PlayerPassingData[] = await getPlayerPassingData(season, 'Rookie', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPassingRookieData.length} QBs`));

      // Sophomore
      controller.enqueue(encoder.encode(`Scraping season ${season} Sophomore QB passing player data...`));
      const qbPassingSophomoreData: PlayerPassingData[] = await getPlayerPassingData(season, 'Sophomore', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPassingSophomoreData.length} QBs`));

      // Professional
      controller.enqueue(encoder.encode(`Scraping season ${season} Professional QB passing player data...`));
      const qbPassingProfessionalData: PlayerPassingData[] = await getPlayerPassingData(season, 'Professional', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPassingProfessionalData.length} QBs`));

      // Veteran
      controller.enqueue(encoder.encode(`Scraping season ${season} Veteran QB passing player data...`));
      const qbPassingVeteranData: PlayerPassingData[] = await getPlayerPassingData(season, 'Veteran', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPassingVeteranData.length} QBs`));

      // Rushing
      // Rookie
      controller.enqueue(encoder.encode(`Scraping season ${season} Rookie QB rushing player data...`));
      const qbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'QB', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPlayerRushingRookieData.length} QBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Rookie HB rushing player data...`));
      const hbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'HB', 10);
      controller.enqueue(encoder.encode(`Scraped ${hbPlayerRushingRookieData.length} HBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Rookie FB rushing player data...`));
      const fbPlayerRushingRookieData: PlayerRushingData[] = await getPlayerRushingData(season, 'Rookie', 'FB', 10);
      controller.enqueue(encoder.encode(`Scraped ${fbPlayerRushingRookieData.length} FBs`));

      // Sophomore
      controller.enqueue(encoder.encode(`Scraping season ${season} Sophomore QB rushing player data...`));
      const qbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'QB', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPlayerRushingSophomoreData.length} QBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Sophomore HB rushing player data...`));
      const hbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'HB', 10);
      controller.enqueue(encoder.encode(`Scraped ${hbPlayerRushingSophomoreData.length} HBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Sophomore FB rushing player data...`));
      const fbPlayerRushingSophomoreData: PlayerRushingData[] = await getPlayerRushingData(season, 'Sophomore', 'FB', 10);
      controller.enqueue(encoder.encode(`Scraped ${fbPlayerRushingSophomoreData.length} FBs`));

      // Professional
      controller.enqueue(encoder.encode(`Scraping season ${season} Professional QB rushing player data...`));
      const qbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'QB', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPlayerRushingProfessionalData.length} QBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Professional HB rushing player data...`));
      const hbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'HB', 10);
      controller.enqueue(encoder.encode(`Scraped ${hbPlayerRushingProfessionalData.length} HBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Professional FB rushing player data...`));
      const fbPlayerRushingProfessionalData: PlayerRushingData[] = await getPlayerRushingData(season, 'Professional', 'FB', 10);
      controller.enqueue(encoder.encode(`Scraped ${fbPlayerRushingProfessionalData.length} FBs`));

      // Veteran
      controller.enqueue(encoder.encode(`Scraping season ${season} Veteran QB rushing player data...`));
      const qbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'QB', 10);
      controller.enqueue(encoder.encode(`Scraped ${qbPlayerRushingVeteranData.length} QBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Veteran HB rushing player data...`));
      const hbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'HB', 10);
      controller.enqueue(encoder.encode(`Scraped ${hbPlayerRushingVeteranData.length} HBs`));

      controller.enqueue(encoder.encode(`Scraping season ${season} Veteran FB rushing player data...`));
      const fbPlayerRushingVeteranData: PlayerRushingData[] = await getPlayerRushingData(season, 'Veteran', 'FB', 10);
      controller.enqueue(encoder.encode(`Scraped ${fbPlayerRushingVeteranData.length} FBs`));

      if (shouldTruncate) {
        controller.enqueue(encoder.encode(`Truncating ${passingTable}...`));
        await truncateTable(passingTable);
        controller.enqueue(encoder.encode('Success'));

        controller.enqueue(encoder.encode(`Truncating ${passingTable}...`));
        await truncateTable(rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      // Passing
      if (qbPassingRookieData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Rookie Passing data to ${passingTable}...`));
        await writePassingDataToDb(qbPassingRookieData, passingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPassingSophomoreData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Sophomore Passing data to ${passingTable}...`));
        await writePassingDataToDb(qbPassingSophomoreData, passingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPassingProfessionalData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Professional Passing data to ${passingTable}...`));
        await writePassingDataToDb(qbPassingProfessionalData, passingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPassingVeteranData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Veteran Passing data to ${passingTable}...`));
        await writePassingDataToDb(qbPassingVeteranData, passingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      // Rushing
      if (qbPlayerRushingRookieData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Rookie Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(qbPlayerRushingRookieData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (hbPlayerRushingRookieData.length > 0) {
        controller.enqueue(encoder.encode(`Writing HB Rookie Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(hbPlayerRushingRookieData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (fbPlayerRushingRookieData.length > 0) {
        controller.enqueue(encoder.encode(`Writing FB Rookie Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(fbPlayerRushingRookieData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPlayerRushingSophomoreData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Sophomore Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(qbPlayerRushingSophomoreData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (hbPlayerRushingSophomoreData.length > 0) {
        controller.enqueue(encoder.encode(`Writing HB Sophomore Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(hbPlayerRushingSophomoreData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (fbPlayerRushingSophomoreData.length > 0) {
        controller.enqueue(encoder.encode(`Writing FB Sophomore Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(fbPlayerRushingSophomoreData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPlayerRushingProfessionalData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Professional Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(qbPlayerRushingProfessionalData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (hbPlayerRushingProfessionalData.length > 0) {
        controller.enqueue(encoder.encode(`Writing HB Professional Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(hbPlayerRushingProfessionalData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (fbPlayerRushingProfessionalData.length > 0) {
        controller.enqueue(encoder.encode(`Writing FB Professional Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(fbPlayerRushingProfessionalData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      if (qbPlayerRushingVeteranData.length > 0) {
        controller.enqueue(encoder.encode(`Writing QB Veteran Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(qbPlayerRushingVeteranData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (hbPlayerRushingVeteranData.length > 0) {
        controller.enqueue(encoder.encode(`Writing HB Veteran Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(hbPlayerRushingVeteranData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }
      if (fbPlayerRushingVeteranData.length > 0) {
        controller.enqueue(encoder.encode(`Writing FB Veteran Rushing data to ${rushingTable}...`));
        await writeRushingDataToDb(fbPlayerRushingVeteranData, rushingTable);
        controller.enqueue(encoder.encode('Success'));
      }

      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
