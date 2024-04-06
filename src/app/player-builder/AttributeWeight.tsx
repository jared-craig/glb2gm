'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../hooks';
import { separateAndCapitalize } from '../helpers/stringManipulation';

export default function AttributeWeight() {
  const attributeWeights = useAppSelector((state) => state.attributeWeight);

  return (
    <Box width={200}>
      {Object.entries(attributeWeights).map(([key, value]) => (
        <Stack direction='row' key={key} sx={{ justifyContent: 'space-between' }}>
          <Typography>{separateAndCapitalize(key)}</Typography>
          <Typography>{value}</Typography>
        </Stack>
      ))}
    </Box>
  );
}
