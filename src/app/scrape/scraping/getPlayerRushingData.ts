import puppeteer from 'puppeteer';
import { PlayerRushingData } from '../interfaces.js';

export const getPlayerRushingData = async (season: string, tier: string, position: string, minRushes: number): Promise<PlayerRushingData[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setDefaultTimeout(180000);
  page.setDefaultNavigationTimeout(180000);

  await page.goto(`https://glb2.warriorgeneral.com/game/home`);

  await page.locator('input[name="user_name"').fill('MadKingCraig');
  await page.locator('input[name="password"').fill('Ludacris123!');
  await page.locator('input[value="LOG IN"').click();

  await page.waitForNavigation();

  await page.goto(`https://glb2.warriorgeneral.com/game/hof?season=${season}&type=off_data&position=${position}&league_id=0&tier=${tier}`);

  await page.waitForSelector('.top_player');

  await page.evaluate(() => {
    const elementsToRemove = document.querySelectorAll('.avatar_lnk');
    elementsToRemove.forEach((x) => x.remove());
  });

  const playerLinks = (await page.$$eval('a[href^="/game/player/"]', (links) => links.map((link) => link.href))).slice(0, 5);

  let allPlayersStats: PlayerRushingData[] = [];

  for (const link of playerLinks) {
    const page = await browser.newPage();
    page.setDefaultTimeout(180000);
    page.setDefaultNavigationTimeout(180000);

    await page.goto(link.replace('player', 'player_stats'));

    const playerName =
      (await page.$eval('.module_name', (el) => el.textContent?.replaceAll('\n', '').replaceAll('\t', '').replaceAll('FREE', '').substring(2))) ?? '';

    const stats = await page.$$eval('::-p-xpath(//div[.//h1[contains(text(), "Rushing")]]) > div > table tbody tr td', (cols) =>
      cols.map((col) => {
        return col.textContent ? +col.textContent : 0;
      })
    );

    if (stats.length <= 0) {
      await page.close();
      continue;
    }

    let index = -1;
    for (let i = 0; i < stats.length; i++) {
      if (stats[i] === 77 && i % 10 === 0) {
        index = i + 1;
        break;
      }
    }

    if (index === -1) {
      await page.close();
      continue;
    }

    const seasonStats = stats.slice(index);

    const playerStats: PlayerRushingData = {
      playerName: playerName,
      position: position,
      rushes: seasonStats[0],
      yards: seasonStats[1],
      average: seasonStats[2],
      touchdowns: seasonStats[3],
      brokenTackles: seasonStats[4],
      yardsAfterContact: seasonStats[5],
      tacklesForLoss: seasonStats[6],
      fumbles: seasonStats[7],
      fumblesLost: seasonStats[8],
      tier: tier,
    };

    if (playerStats.rushes >= minRushes) allPlayersStats = [...allPlayersStats, playerStats];

    await page.close();
  }

  await browser.close();

  return allPlayersStats;
};
