import { Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { TeamBuilderTeam } from './teamBuilderTeam';

interface LoadTeamDialogProps {
  options: TeamBuilderTeam[];
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export default function LoadTeamDialog(props: LoadTeamDialogProps) {
  const { onClose, options, value: valueProp, open } = props;
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth='xs' open={open}>
      <DialogTitle>Load Team</DialogTitle>
      <DialogContent dividers>
        <RadioGroup aria-label='team' name='team' value={value} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel value={option.id} key={option.id} control={<Radio />} label={option.team_name} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
