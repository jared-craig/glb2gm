import { LinearProgressProps, Box, LinearProgress, Typography } from '@mui/material';

export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} sx={{ height: '20px' }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
