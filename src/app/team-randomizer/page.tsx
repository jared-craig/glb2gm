'use client';

import { Button, Container, Divider, LinearProgress, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Trait } from '../team-builder/trait';
import { TeamRandomizerPlayer } from './teamRandomizerPlayer';
import StarIcon from '@mui/icons-material/Star';
import { getSalary } from '../players/salaries';

export default function TeamRandomizer() {
  const [traits, setTraits] = useState<Trait[]>();
  const [capRemaining, setCapRemaining] = useState<number>(150000000);
  const [players, setPlayers] = useState<TeamRandomizerPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [optimalTeamComp, setOptimalTeamComp] = useState<any>({
    QB: { min: 1, max: 1, maxStars: 1, traitOptions: [], starPower: 50 },
    FB: { min: 2, max: 2, maxStars: 1, traitOptions: [], starPower: 1 },
    HB: { min: 1, max: 1, maxStars: 1, traitOptions: [], starPower: 100 },
    WR: { min: 3, max: 5, maxStars: 3, traitOptions: [], starPower: 30 },
    TE: { min: 1, max: 3, maxStars: 2, traitOptions: [], starPower: 50 },
    C: { min: 3, max: 3, maxStars: 1, traitOptions: [], starPower: 1 },
    G: { min: 5, max: 5, maxStars: 2, traitOptions: [], starPower: 1 },
    OT: { min: 5, max: 5, maxStars: 2, traitOptions: [], starPower: 1 },
    DT: { min: 2, max: 3, maxStars: 3, traitOptions: [], starPower: 60 },
    DE: { min: 2, max: 2, maxStars: 2, traitOptions: [], starPower: 50 },
    LB: { min: 3, max: 4, maxStars: 3, traitOptions: [], starPower: 70 },
    CB: { min: 2, max: 4, maxStars: 2, traitOptions: [], starPower: 50 },
    FS: { min: 1, max: 2, maxStars: 1, traitOptions: [], starPower: 45 },
    SS: { min: 1, max: 2, maxStars: 1, traitOptions: [], starPower: 55 },
    K: { min: 1, max: 1, maxStars: 1, traitOptions: [], starPower: 10 },
    P: { min: 1, max: 1, maxStars: 0, traitOptions: [], starPower: 0 },
  });

  const fetchData = async () => {
    const traitsRes = await fetch('/api/traits');
    const traitsData: Trait[] = await traitsRes.json();
    setTraits(traitsData);
  };

  const calculateCap = () => {
    if (traits) setCapRemaining(150000000 - players.reduce((sum, player) => sum + (getSalary(traits, player) || 0), 0));
  };

  const buildTeam = async (): Promise<TeamRandomizerPlayer[]> => {
    if (!traits) return [];
    const reqBody: any = {
      traits,
      optimalTeamComp,
    };
    const res = await fetch('/api/team-randomizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });
    if (res.ok) {
      const result = await res.json();
      return result.newPlayers;
    }
    return [];
  };

  const ensureMinPositions = (players: TeamRandomizerPlayer[]): boolean => {
    const playersByPosition: Record<string, TeamRandomizerPlayer[]> = {};
    let sufficient = true;

    players.forEach((player) => {
      playersByPosition[player.position] = playersByPosition[player.position] || [];
      playersByPosition[player.position].push(player);
    });

    for (const position in optimalTeamComp) {
      const config = optimalTeamComp[position];
      const currentCount = playersByPosition[position]?.length || 0;

      if (currentCount < config.min) {
        sufficient = false;
        break;
      }
    }
    return sufficient;
  };

  const handleRandomizeClick = async () => {
    setLoading(true);
    setPlayers([]);

    let players: TeamRandomizerPlayer[] = [];
    let tries = 0;
    while (!ensureMinPositions(players) && tries <= 100) {
      players = await buildTeam();
      tries++;
    }

    setPlayers(players.sort((a, b) => b.salary - a.salary));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateCap();
  }, [players]);

  return (
    <Container maxWidth='xl' sx={{ mb: 1 }}>
      {traits && (
        <Grid container size={12} spacing={0.5}>
          <Grid container size={12} sx={{ alignItems: 'center' }}>
            {loading ? (
              <Grid size={9}>
                <Typography>
                  <Skeleton />
                </Typography>
              </Grid>
            ) : (
              <>
                <Grid size={3}>
                  <Typography>Players: {players.length}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography>Stars: {players.filter((x) => x.trait1 === 'superstar_glam').length}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography sx={{ color: capRemaining < 0 ? 'red' : '' }}>Cap Remaining: {capRemaining.toLocaleString()}</Typography>
                </Grid>
              </>
            )}

            <Grid size={3} sx={{ textAlign: 'right' }}>
              <Button size='small' variant='contained' onClick={handleRandomizeClick} disabled={!traits || loading}>
                Randomize
              </Button>
            </Grid>
          </Grid>
          {loading && <LinearProgress />}
          {!loading && players.length > 0 && (
            <Grid container size={12} spacing={1}>
              {Object.entries(optimalTeamComp)
                .filter((x) => ['QB', 'FB', 'HB', 'WR', 'TE', 'C', 'G', 'OT'].includes(x[0]))
                .map(([key, value]: any) => (
                  <Grid key={key} size={3} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1 }}>
                    <Typography sx={{ textAlign: 'center', pb: 1 }}>
                      {key} - ({players.filter((x) => x.position === key).length}/{value.max})
                    </Typography>
                    {players
                      .filter((x) => x.position === key)
                      .map((player) => (
                        <Stack key={player.id} spacing={0.5} sx={{ alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 2, p: 0.5 }}>
                          <Typography variant='caption' sx={{ display: 'flex', alignItems: 'center' }}>
                            {(player.trait1.includes('superstar') || player.trait2.includes('superstar') || player.trait3.includes('superstar')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'gold' }} />
                            )}
                            {(player.trait1.includes('prodigy') || player.trait2.includes('prodigy') || player.trait3.includes('prodigy')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'silver' }} />
                            )}
                            {player.salary.toLocaleString()}
                            {player.contract !== 'Medium' && ` [${player.contract}]`}
                          </Typography>
                        </Stack>
                      ))}
                  </Grid>
                ))}
              <Grid size={12}>
                <Divider />
              </Grid>
              {Object.entries(optimalTeamComp)
                .filter((x) => ['DT', 'DE', 'LB', 'CB', 'FS', 'SS'].includes(x[0]))
                .map(([key, value]: any) => (
                  <Grid key={key} size={3} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1, minWidth: 205 }}>
                    <Typography sx={{ textAlign: 'center', pb: 1 }}>
                      {key} - ({players.filter((x) => x.position === key).length}/{value.max})
                    </Typography>
                    {players
                      .filter((x) => x.position === key)
                      .map((player) => (
                        <Stack key={player.id} spacing={0.5} sx={{ alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 2, p: 0.5 }}>
                          <Typography variant='caption' sx={{ display: 'flex', alignItems: 'center' }}>
                            {(player.trait1.includes('superstar') || player.trait2.includes('superstar') || player.trait3.includes('superstar')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'gold' }} />
                            )}
                            {(player.trait1.includes('prodigy') || player.trait2.includes('prodigy') || player.trait3.includes('prodigy')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'silver' }} />
                            )}
                            {player.salary.toLocaleString()}
                            {player.contract !== 'Medium' && ` [${player.contract}]`}
                          </Typography>
                        </Stack>
                      ))}
                  </Grid>
                ))}
              <Grid size={12}>
                <Divider />
              </Grid>
              {Object.entries(optimalTeamComp)
                .filter((x) => ['K', 'P'].includes(x[0]))
                .map(([key, value]: any) => (
                  <Grid key={key} size={3} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1, minWidth: 205 }}>
                    <Typography sx={{ textAlign: 'center', pb: 1 }}>
                      {key} - ({players.filter((x) => x.position === key).length}/{value.max})
                    </Typography>
                    {players
                      .filter((x) => x.position === key)
                      .map((player) => (
                        <Stack key={player.id} spacing={0.5} sx={{ alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 2, p: 0.5 }}>
                          <Typography variant='caption' sx={{ display: 'flex', alignItems: 'center' }}>
                            {(player.trait1.includes('superstar') || player.trait2.includes('superstar') || player.trait3.includes('superstar')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'gold' }} />
                            )}
                            {(player.trait1.includes('prodigy') || player.trait2.includes('prodigy') || player.trait3.includes('prodigy')) && (
                              <StarIcon fontSize='small' sx={{ mr: 0.5, color: 'silver' }} />
                            )}
                            {player.salary.toLocaleString()}
                            {player.contract !== 'Medium' && ` [${player.contract}]`}
                          </Typography>
                        </Stack>
                      ))}
                  </Grid>
                ))}
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
