import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 24,
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
  skillCost: number;
}

export default function SkillBar(props: SkillBarProps) {
  const { skillLevel, skillCost } = props;
  return (
    <Box sx={{ position: 'relative' }}>
      <CustomLinearProgress variant='determinate' value={skillLevel} />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '8%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant='body2'>{skillLevel}</Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '92%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant='body2'>{skillCost}</Typography>
      </Box>
    </Box>
  );
}