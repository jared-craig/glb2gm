import { FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridToolbarContainer, GridToolbarQuickFilter, ToolbarPropsOverrides } from '@mui/x-data-grid-premium';

declare module '@mui/x-data-grid-premium' {
  interface ToolbarPropsOverrides {
    tier: string;
    tierFilter: (tier: string) => void;
    tierOptions: string[];
    season: string;
    seasonFilter: (season: string) => void;
    seasonOptions: string[];
  }
}

export function CustomGridToolbarWithTier({ tier, tierFilter, tierOptions }: ToolbarPropsOverrides) {
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 78 * 4.5 + 8,
      },
    },
  };

  const handleTierSelectChange = (event: SelectChangeEvent<string>) => {
    tierFilter(event.target.value);
  };

  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter sx={{ display: 'flex', width: 150, pt: 1.2 }} />
      <FormControl variant='standard' sx={{ display: 'flex', width: 150, ml: 2 }} size='small'>
        <Select id='tier-select' value={tier} label='Tier' onChange={handleTierSelectChange} MenuProps={MenuProps}>
          {tierOptions.map((tier: string) => (
            <MenuItem key={tier} value={tier}>
              <ListItemText primary={tier} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </GridToolbarContainer>
  );
}

export function CustomGridToolbarWithTierAndSeason({ tier, tierFilter, tierOptions, season, seasonFilter, seasonOptions }: ToolbarPropsOverrides) {
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 78 * 4.5 + 8,
      },
    },
  };

  const handleTierSelectChange = (event: SelectChangeEvent<string>) => {
    tierFilter(event.target.value);
  };

  const handleSeasonSelectChange = (event: SelectChangeEvent<string>) => {
    seasonFilter(event.target.value);
  };

  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter sx={{ display: 'flex', width: 150, pt: 1.2 }} />
      <FormControl variant='standard' sx={{ display: 'flex', width: 150, ml: 2 }} size='small'>
        <Select id='tier-select' value={tier} label='Tier' onChange={handleTierSelectChange} MenuProps={MenuProps}>
          {tierOptions.map((tier: string) => (
            <MenuItem key={tier} value={tier}>
              <ListItemText primary={tier} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant='standard' sx={{ display: 'flex', width: 150, ml: 2 }} size='small'>
        <Select id='season-select' value={season} label='Season' onChange={handleSeasonSelectChange} MenuProps={MenuProps}>
          {seasonOptions.map((season: string) => (
            <MenuItem key={season} value={season}>
              <ListItemText primary={`Season ${season}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </GridToolbarContainer>
  );
}
