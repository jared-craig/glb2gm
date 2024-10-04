import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface DeleteTeamDialogProps {
  value: string;
  open: boolean;
  onClose: (shouldDelete: boolean) => void;
}

export default function DeleteTeamDialog(props: DeleteTeamDialogProps) {
  const { value, onClose, open } = props;

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth='xs' open={open}>
      <DialogTitle>Delete Team</DialogTitle>
      <DialogContent>
        <DialogContentText>You are about to delete {value}</DialogContentText>
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
