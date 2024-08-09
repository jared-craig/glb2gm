import { Box, FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid-pro';
import { useState } from 'react';

const tierOptions = ['Rookie', 'Sophomore', 'Professional', 'Veteran'];

function CustomGridToolbar({ tierFilter }: any) {
  const [tier, setTier] = useState<string>('Veteran');
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 78 * 4.5 + 8,
      },
    },
  };

  const handleTierSelectChange = (event: SelectChangeEvent<string>) => {
    tierFilter(event.target.value);
    setTier(event.target.value);
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
export default CustomGridToolbar;
