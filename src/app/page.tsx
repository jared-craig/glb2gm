import { Box, Button, Typography } from '@mui/material';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <Box>
        <Typography variant='h1'>GLB2 GM</Typography>
      </Box>
      <div className={styles.center}>
        <Button variant='contained'>
          <Link href='/player-builder'>Player Builder</Link>
        </Button>
      </div>

      <div className={styles.grid}></div>
    </main>
  );
}
