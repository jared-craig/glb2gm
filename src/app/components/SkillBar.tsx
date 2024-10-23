import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`&.${linearProgressClasses.bar2Buffer}`]: {
    borderRadius: 0,
  },
  [`& .${linearProgressClasses.bar1Buffer}`]: {
    borderRadius: 0,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
  [`& .${linearProgressClasses.dashed}`]: {
    animation: 'none',
    background: 'none',
  },
}));

interface SkillBarProps {
  skillLevel: number;
  maxSkillLevel: number;
  skillCost: number;
  capBoostsSpent: number;
}

export default function SkillBar(props: SkillBarProps) {
  const { skillLevel, maxSkillLevel, skillCost, capBoostsSpent } = props;

  return (
    <Box sx={{ position: 'relative' }}>
      <CustomLinearProgress variant='buffer' sx={{ height: 24 }} value={skillLevel} valueBuffer={maxSkillLevel} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          pl: 2,
        }}
      >
        <Typography variant='body1' sx={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}>
          {skillLevel} of {maxSkillLevel} {capBoostsSpent > 0 && `(${capBoostsSpent})`}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          pr: 2,
        }}
      >
        <Typography variant='body1' sx={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}>
          {skillCost}
        </Typography>
      </Box>
    </Box>
  );
}
