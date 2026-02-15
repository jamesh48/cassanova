import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface DeleteConfirmationDialogProps {
  deleteDialogOpen: boolean
  handleDeleteCancel: () => void
  handleDeleteConfirm: () => void
  confirmationMessage?: string
  confirmationTitle?: string
}

const DeleteConfirmationDialog = ({
  deleteDialogOpen,
  handleDeleteCancel,
  handleDeleteConfirm,
  confirmationMessage,
  confirmationTitle,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleDeleteCancel}
      aria-labelledby='delete-dialog-title'
      aria-describedby='delete-dialog-description'
    >
      <DialogTitle id='delete-dialog-title'>
        {confirmationTitle || 'Confirm Delete'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-dialog-description'>
          {confirmationMessage ||
            'Are you sure you want to delete this? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel} color='inherit' variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          color='error'
          variant='contained'
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
