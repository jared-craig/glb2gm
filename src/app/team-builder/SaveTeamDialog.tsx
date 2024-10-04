import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';

interface SaveTeamDialogProps {
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export default function SaveTeamDialog(props: SaveTeamDialogProps) {
  const { value: valueProp, open, onClose } = props;
  const [value, setValue] = useState(valueProp);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth='xs' open={open}>
      <DialogTitle>Save Team</DialogTitle>
      <DialogContent>
        <TextField autoFocus required label='Team Name' fullWidth size='small' sx={{ my: 2 }} value={value} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
