import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface UpdateTeamDialogProps {
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export default function SaveTeamDialog(props: UpdateTeamDialogProps) {
  const { value, open, onClose } = props;
  const [teamValue, setTeamValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamValue((event.target as HTMLInputElement).value);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(teamValue);
  };

  useEffect(() => {
    setTeamValue(value);
  }, [value]);

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth='xs' open={open}>
      <DialogTitle>Update Team</DialogTitle>
      <DialogContent>
        <TextField autoFocus required label='Team Name' fullWidth size='small' sx={{ my: 2 }} value={teamValue} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
