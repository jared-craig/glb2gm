import { LinearProgressProps, Box, LinearProgress, Typography, linearProgressClasses, styled } from '@mui/material';

const CustomLinearProgressWithLabel = styled(LinearProgress)(() => ({
  borderRadius: 5,
  [`& .${linearProgressClasses.dashed}`]: {
    animation: 'pulse-dashed 3s ease-in-out infinite',
  },
}));

export default function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <CustomLinearProgressWithLabel variant='buffer' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
