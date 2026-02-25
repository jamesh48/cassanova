import { Close, DeleteForeverOutlined, Edit, Save } from '@mui/icons-material'
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import * as yup from 'yup'
import SimpleForm from '@/components/shared-components'
import DeleteConfirmationDialog from '@/components/shared-components/DeleteConfirmationDialog'
import type { Prospect } from '@/types'

interface ViewOrEditProspectProps {
  defaultValues: Prospect
  handleClose: () => void
  onDelete: (prospectId: number) => Promise<void>
  onUpdate: (prospect: Prospect) => Promise<void>
}

const ViewOrEditProspect = ({
  defaultValues,
  handleClose,
  onDelete,
  onUpdate,
}: ViewOrEditProspectProps) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    await onDelete(defaultValues.id)
    setDeleteDialogOpen(false)
    handleClose()
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleUpdate = async (prospect: Prospect) => {
    await onUpdate(prospect)
    setIsEditMode(false)
  }

  const prospectValues = useMemo(() => {
    return defaultValues
  }, [defaultValues])

  // View Mode
  if (!isEditMode) {
    return (
      <>
        <Box
          sx={{
            width: '100%',
            padding: 3,
            position: 'relative',
          }}
        >
          {/* Header with Edit Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Typography variant='h5' component='h2' fontWeight={600}>
              Prospect Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setIsEditMode(true)}
                color='primary'
                size='small'
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={handleClose}
                size='small'
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Name Field */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Box flex='1'>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Name
              </Typography>
              <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                {prospectValues.name || (
                  <em style={{ color: 'text.secondary' }}>No name</em>
                )}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Box flex='1'>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Age
              </Typography>
              <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                {prospectValues.age || (
                  <em style={{ color: 'text.secondary' }}>---</em>
                )}
              </Typography>
            </Box>
            <Box flex='1'>
              {' '}
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Occupation
              </Typography>
              <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                {prospectValues.occupation || (
                  <em style={{ color: 'text.secondary' }}>---</em>
                )}
              </Typography>
            </Box>
          </Box>

          {/* Notes Field */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Notes
            </Typography>
            <Typography
              variant='body1'
              sx={{
                mt: 0.5,
                whiteSpace: 'pre-wrap',
                color: prospectValues.notes ? 'text.primary' : 'text.secondary',
                fontStyle: prospectValues.notes ? 'normal' : 'italic',
              }}
            >
              {prospectValues.notes || 'No notes added'}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Delete Button */}
          <Box>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                mb: 1,
                display: 'block',
              }}
            >
              Danger Zone
            </Typography>
            <Chip
              icon={<DeleteForeverOutlined />}
              label='Delete Prospect'
              color='error'
              variant='outlined'
              onClick={handleDeleteClick}
              sx={{
                borderStyle: 'dashed',
              }}
            />
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          handleDeleteConfirm={handleDeleteConfirm}
          handleDeleteCancel={handleDeleteCancel}
          confirmationMessage={`Are you sure you want to delete ${prospectValues.name}? This action cannot be
          undone.`}
          confirmationTitle='Delete Prospect?'
          deleteDialogOpen={deleteDialogOpen}
        />
      </>
    )
  }

  // Edit Mode
  return (
    <Stack>
      <SimpleForm<Prospect>
        title='Edit Prospect'
        onSubmit={handleUpdate}
        inputs={[
          {
            name: 'name',
            inputType: 'text',
            label: 'Name',
            rules: { required: 'Name is required' },
          },
          {
            name: 'age',
            inputType: 'text',
            label: 'Prospect Age',
            rules: { required: false },
          },
          {
            name: 'occupation',
            label: 'Prospect Occupation',
            inputType: 'text',
            rules: {
              required: false,
            },
          },
          {
            name: 'notes',
            inputType: 'textarea',
            label: 'Notes',
            rows: 4,
            maxRows: 8,
            placeholder: 'Add any notes about this prospect...',
          },
        ]}
        schema={yup.object<Prospect>({
          name: yup.string().required('Name is Required'),
          age: yup
            .number()
            .typeError('Must be a number')
            .min(18, 'This app is for adults')
            .optional(),
          occupation: yup.string().optional(),
          notes: yup.string().optional(),
        })}
        secondaryButtonProps={{
          children: 'Cancel Edits',
          onClick: () => setIsEditMode(false),
        }}
        actionButtonProps={{
          children: (
            <>
              <Save sx={{ mr: 1 }} />
              Save
            </>
          ),
        }}
        deleteButtonProps={{
          children: (
            <>
              <DeleteForeverOutlined sx={{ mr: 1 }} />
              Delete Prospect
            </>
          ),
          onClick: async () => {
            await onDelete(prospectValues.id)
            handleClose()
          },
          confirmationTitle: 'Delete Prospect?',
          confirmationMessage: `Are you sure you want to delete ${prospectValues.name}? This action cannot be undone.`,
        }}
        defaultValues={prospectValues}
        fullWidth
        snackbarProps={{
          successMessage: 'Prospect updated successfully',
          failureMessage: 'Failed to update prospect',
        }}
      />
    </Stack>
  )
}

export default ViewOrEditProspect
