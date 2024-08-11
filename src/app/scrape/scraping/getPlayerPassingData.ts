import puppeteer from 'puppeteer';
import { PlayerPassingData } from '../interfaces.js';

export const getPlayerPassingData = async (season: string, tier: string, minAttempts: number): Promise<PlayerPassingData[]> => {
  console.log(`Scraping season ${season} ${tier} QB passing player data...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setDefaultTimeout(180000);
  page.setDefaultNavigationTimeout(180000);

  await page.goto('https://glb2.warriorgeneral.com/game/home');

  await page.locator('input[name="user_name"').fill('MadKingCraig');
  await page.locator('input[name="password"').fill('Ludacris123!');
  await page.locator('input[value="LOG IN"').click();

  await page.waitForNavigation();

  await page.goto(`https://glb2.warriorgeneral.com/game/hof?season=${season}&type=off_data&position=QB&league_id=0&tier=${tier}`);

  await page.waitForSelector('.top_player');

  await page.evaluate(() => {
    const elementsToRemove = document.querySelectorAll('.avatar_lnk');
    elementsToRemove.forEach((x) => x.remove());
  });

  const playerLinks = await page.$$eval('a[href^="/game/player/"]', (links) => links.map((link) => link.href));

  let allPlayersStats: PlayerPassingData[] = [];

  for (const link of playerLinks) {
    const page = await browser.newPage();
    page.setDefaultTimeout(180000);
    page.setDefaultNavigationTimeout(180000);

    await page.goto(link.replace('player', 'player_stats'));

    const playerName =
      (await page.$eval('.module_name', (el) => el.textContent?.replaceAll('\n', '').replaceAll('\t', '').replaceAll('FREE', '').substring(2))) ?? '';

    const stats = await page.$$eval('::-p-xpath(//div[.//h1[contains(text(), "Passing")]]) > div > table tbody tr td', (cols) =>
      cols.map((col) => {
        return col.textContent ? (col.textContent.includes('%') ? +col.textContent.replace('%', '') : +col.textContent) : 0;
      })
    );

    if (stats.length <= 0) {
      await page.close();
      continue;
    }

    let index = -1;
    for (let i = 0; i < stats.length; i++) {
      if (stats[i] === 77 && i % 11 === 0) {
        index = i + 1;
        break;
      }
    }

    if (index === -1) {
      await page.close();
      continue;
    }

    const seasonStats = stats.slice(index);

    const playerStats: PlayerPassingData = {
      playerName: playerName,
      completions: seasonStats[0],
      attempts: seasonStats[1],
      yards: seasonStats[2],
      completionPercentage: seasonStats[3],
      yardsPerAttempt: seasonStats[4],
      hurries: seasonStats[5],
      sacks: seasonStats[6],
      sackYards: seasonStats[7],
      interceptions: seasonStats[8],
      touchdowns: seasonStats[9],
      tier: tier,
    };

    if (playerStats.attempts >= minAttempts) allPlayersStats = [...allPlayersStats, playerStats];

    await page.close();
  }

  await browser.close();

  console.log(`Scraped ${allPlayersStats.length} QBs`);

  return allPlayersStats;
};
