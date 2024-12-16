import { FormControl, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GridToolbarContainer, GridToolbarQuickFilter, ToolbarPropsOverrides } from '@mui/x-data-grid-premium';
import { useState } from 'react';

declare module '@mui/x-data-grid-premium' {
  interface ToolbarPropsOverrides {
    tierFilter: (tier: string) => void;
    tierOptions: string[];
  }
}

function CustomGridToolbar(props: ToolbarPropsOverrides) {
  const { tierFilter, tierOptions } = props;
  const [tier, setTier] = useState<string>(tierOptions[tierOptions.length - 1]);
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
