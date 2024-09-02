import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
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

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box sx={{ position: 'relative' }}>
      <CustomLinearProgress variant='determinate' sx={{ height: mobile ? 18 : 30.75 }} value={skillLevel} />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography sx={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}>
          {skillLevel} of {maxSkillLevel} {capBoostsSpent && `(${capBoostsSpent})`}
        </Typography>
      </Box>
      {/* <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '92%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant='body2'>{skillCost}</Typography>
      </Box> */}
    </Box>
  );
}
