import mssql from 'mssql';
import { PlayerPassingData, PlayerRushingData } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

export const truncateTable = async (table: string) => {
  try {
    await mssql.connect(process.env.DATABASE_SCRAPE_URL ?? '');
    switch (table) {
      case 'Rushing':
        await mssql.query`TRUNCATE TABLE Rushing`;
        break;
      case 'Passing':
        await mssql.query`TRUNCATE TABLE Passing`;
        break;
      case 'RushingTest':
        await mssql.query`TRUNCATE TABLE RushingTest`;
        break;
      case 'PassingTest':
        await mssql.query`TRUNCATE TABLE PassingTest`;
        break;
      default:
        break;
    }
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const writeRushingDataToDb = async (data: PlayerRushingData[], tableDestination: string): Promise<void> => {
  try {
    await mssql.connect(process.env.DATABASE_SCRAPE_URL ?? '');

    const table = new mssql.Table(tableDestination);
    table.columns.add('id', mssql.UniqueIdentifier, { nullable: false, primary: true });
    table.columns.add('player_name', mssql.NVarChar(mssql.MAX), { nullable: false });
    table.columns.add('position', mssql.NVarChar(50), { nullable: false });
    table.columns.add('rushes', mssql.Int, { nullable: false });
    table.columns.add('yards', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('average', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('touchdowns', mssql.Int, { nullable: false });
    table.columns.add('broken_tackles', mssql.Int, { nullable: false });
    table.columns.add('yards_after_contact', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('tackles_for_loss', mssql.Int, { nullable: false });
    table.columns.add('fumbles', mssql.Int, { nullable: false });
    table.columns.add('fumbles_lost', mssql.Int, { nullable: false });
    table.columns.add('tier', mssql.NVarChar(mssql.MAX), { nullable: false });
    data.forEach((row: any) =>
      table.rows.add(
        uuidv4(),
        row.playerName,
        row.position,
        row.rushes,
        row.yards,
        row.average,
        row.touchdowns,
        row.brokenTackles,
        row.yardsAfterContact,
        row.tacklesForLoss,
        row.fumbles,
        row.fumblesLost,
        row.tier
      )
    );

    const request = new mssql.Request();
    request.bulk(table, async (err, result) => {
      if (err) throw new Error(`${err}`);
    });
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const writePassingDataToDb = async (data: PlayerPassingData[], tableDestination: string): Promise<void> => {
  try {
    await mssql.connect(process.env.DATABASE_SCRAPE_URL ?? '');

    const table = new mssql.Table(tableDestination);
    table.columns.add('id', mssql.UniqueIdentifier, { nullable: false, primary: true });
    table.columns.add('player_name', mssql.NVarChar(mssql.MAX), { nullable: false });
    table.columns.add('completions', mssql.Int, { nullable: false });
    table.columns.add('attempts', mssql.Int, { nullable: false });
    table.columns.add('yards', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('completion_percentage', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('yards_per_attempt', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('hurries', mssql.Int, { nullable: false });
    table.columns.add('sacks', mssql.Int, { nullable: false });
    table.columns.add('sack_yards', mssql.Decimal(18, 1), { nullable: false });
    table.columns.add('interceptions', mssql.Int, { nullable: false });
    table.columns.add('touchdowns', mssql.Int, { nullable: false });
    table.columns.add('tier', mssql.NVarChar(mssql.MAX), { nullable: false });
    data.forEach((row: any) =>
      table.rows.add(
        uuidv4(),
        row.playerName,
        row.completions,
        row.attempts,
        row.yards,
        row.completionPercentage,
        row.yardsPerAttempt,
        row.hurries,
        row.sacks,
        row.sackYards,
        row.interceptions,
        row.touchdowns,
        row.tier
      )
    );

    const request = new mssql.Request();
    request.bulk(table, async (err, result) => {
      if (err) throw new Error(`${err}`);
    });
  } catch (err) {
    throw new Error(`${err}`);
  }
};
