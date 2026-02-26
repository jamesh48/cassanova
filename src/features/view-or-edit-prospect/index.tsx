import { Close, DeleteForeverOutlined, Edit } from '@mui/icons-material'
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import LocationMap from '@/components/location-map'
import DeleteConfirmationDialog from '@/components/shared-components/DeleteConfirmationDialog'
import CreateOrEditProspectForm from '@/features/prospect/CreateOrEditProspectForm'
import ViewProspectDetail from '@/features/view-or-edit-prospect/ViewProspectDetail'
import { useLocationDistance } from '@/hooks'
import { useGetCurrentUserQuery } from '@/redux/services'
import type { Prospect } from '@/types'

interface ViewOrEditProspectProps {
  defaultValues: Prospect
  handleClose: () => void
  onDelete: (prospectId: number) => Promise<void>
  onUpdate: (prospect: Prospect) => Promise<void>
  isLoadingUpdateProspect: boolean
}

const ViewOrEditProspect = ({
  defaultValues,
  handleClose,
  onDelete,
  onUpdate,
  isLoadingUpdateProspect,
}: ViewOrEditProspectProps) => {
  const { data: currentUser } = useGetCurrentUserQuery()

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

  const handleDelete = async () => {
    await onDelete(prospectValues.id)
    handleClose()
  }

  const handleCancel = () => {
    setIsEditMode(false)
  }

  const prospectValues = useMemo(() => {
    return {
      ...defaultValues,
      // Cast null as empty string
      age: defaultValues.age === null ? '' : defaultValues.age,
    }
  }, [defaultValues])

  const { distanceMiles } = useLocationDistance(
    prospectValues.location,
    currentUser?.userLocation,
  )

  const mileageLabel = useMemo(() => {
    const miles = distanceMiles?.toFixed(1)
    if (miles) {
      return `${prospectValues.location} - ${miles} Miles Away`
    }
    return prospectValues.location
  }, [prospectValues.location, distanceMiles])

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
            <ViewProspectDetail label='Name' value={prospectValues.name} />
          </Box>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <ViewProspectDetail
              label='Age'
              value={prospectValues.age?.toString() || ''}
            />
            <ViewProspectDetail
              label='Occupation'
              value={prospectValues.occupation}
            />
          </Box>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <ViewProspectDetail
              label='Prospect Location'
              value={mileageLabel}
            />
            <LocationMap
              location={prospectValues.location}
              userLocation={currentUser?.userLocation}
            />
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
              sx={{ borderStyle: 'dashed' }}
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
      <CreateOrEditProspectForm
        mode='edit'
        prospectValues={prospectValues}
        handleSubmit={handleUpdate}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
        isLoading={isLoadingUpdateProspect}
      />
    </Stack>
  )
}

export default ViewOrEditProspect
