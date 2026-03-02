import { Close, DeleteForeverOutlined, Edit } from '@mui/icons-material'
import ContactsIcon from '@mui/icons-material/Contacts'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MessageIcon from '@mui/icons-material/Message'
import PhoneIcon from '@mui/icons-material/Phone'
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

const LocationMap = dynamic(() => import('@/components/location-map'), {
  ssr: false,
})

import DeleteConfirmationDialog from '@/components/shared-components/DeleteConfirmationDialog'
import ProspectTags from '@/features/ProspectTags'
import CreateOrEditProspectForm from '@/features/prospect/CreateOrEditProspectForm'
import ViewProspectDetail from '@/features/view-or-edit-prospect/ViewProspectDetail'
import { useLocationDistance, useSnackbar } from '@/hooks'
import { useGetCurrentUserQuery } from '@/redux/services'
import type { Prospect } from '@/types'
import { formatPhoneNumber, stripPhoneNumberFormatting } from '@/utils'

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
  const revealSnackbar = useSnackbar()

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

  const handleCopyPhoneNumber = async () => {
    const rawPhoneNumber = stripPhoneNumberFormatting(defaultValues.phoneNumber)
    if (rawPhoneNumber) {
      try {
        await navigator.clipboard.writeText(rawPhoneNumber)
        revealSnackbar('Phone number copied to clipboard', {
          variant: 'success',
        })
      } catch (_err) {
        revealSnackbar('Failed to copy phone number', { variant: 'error' })
      }
    }
  }

  const handleCallPhoneNumber = () => {
    const rawPhoneNumber = stripPhoneNumberFormatting(defaultValues.phoneNumber)
    if (rawPhoneNumber) {
      window.location.href = `tel:${rawPhoneNumber}`
    }
  }

  const handleTextPhoneNumber = () => {
    const rawPhoneNumber = stripPhoneNumberFormatting(defaultValues.phoneNumber)
    if (rawPhoneNumber) {
      window.location.href = `sms:${rawPhoneNumber}`
    }
  }

  const handleAddToContacts = () => {
    const rawPhoneNumber = stripPhoneNumberFormatting(defaultValues.phoneNumber)

    // Parse name into first and last name
    const nameParts = defaultValues.name.trim().split(' ')
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0]

    // Create vCard format
    // N format: LastName;FirstName;MiddleName;Prefix;Suffix
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${defaultValues.name}`,
      `N:${lastName};${firstName};;;`,
      rawPhoneNumber ? `TEL;TYPE=CELL:${rawPhoneNumber}` : '',
      defaultValues.notes
        ? `NOTE:${defaultValues.notes.replace(/\n/g, '\\n')}`
        : '',
      defaultValues.location ? `ADR:;;${defaultValues.location};;;;` : '',
      defaultValues.occupation ? `TITLE:${defaultValues.occupation}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n')

    // Detect mobile devices (iOS, iPadOS, Android)
    const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent)

    if (isMobile) {
      // On mobile, use data URI to trigger native contacts app
      const dataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`
      window.location.href = dataUri
      revealSnackbar('Opening contact...', { variant: 'success' })
    } else {
      // On desktop (macOS, Windows, Linux), download the vCard file
      const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${defaultValues.name.replace(/\s+/g, '_')}.vcf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      revealSnackbar('Contact card downloaded - double-click to add to Contacts', { variant: 'success' })
    }
  }

  const prospectValues = useMemo(() => {
    return {
      ...defaultValues,
      // Cast null as empty string
      age: defaultValues.age === null ? '' : defaultValues.age,
      phoneNumber: formatPhoneNumber(defaultValues.phoneNumber),
    }
  }, [defaultValues])

  const { distanceMiles, loading: loadingDistance } = useLocationDistance(
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
              <Tooltip title='Add to contacts'>
                <IconButton
                  onClick={handleAddToContacts}
                  color='primary'
                  size='small'
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <ContactsIcon />
                </IconButton>
              </Tooltip>
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

          {/* Name Field */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <ViewProspectDetail label='Name' value={prospectValues.name} />
            <ViewProspectDetail
              label='Phone Number'
              value={prospectValues.phoneNumber}
              actionPanel={
                prospectValues.phoneNumber
                  ? [
                      <Tooltip key='copy' title='Copy phone number'>
                        <IconButton
                          size='small'
                          onClick={handleCopyPhoneNumber}
                          sx={{
                            padding: '2px',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: '0.875rem' }} />
                        </IconButton>
                      </Tooltip>,
                      <Tooltip key='text' title='Text phone number'>
                        <IconButton
                          size='small'
                          onClick={handleTextPhoneNumber}
                          sx={{
                            padding: '2px',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <MessageIcon sx={{ fontSize: '0.875rem' }} />
                        </IconButton>
                      </Tooltip>,
                      <Tooltip key='call' title='Call phone number'>
                        <IconButton
                          size='small'
                          onClick={handleCallPhoneNumber}
                          sx={{
                            padding: '2px',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: '0.875rem' }} />
                        </IconButton>
                      </Tooltip>,
                    ]
                  : undefined
              }
            />
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

          <Divider sx={{ my: 1.5 }} />

          <ProspectTags
            prospectId={defaultValues.id}
            existingTagValue={defaultValues.tags.map((tag) => tag.tag)}
          />

          <Divider sx={{ my: 1.5 }} />
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
              tooltip={
                !loadingDistance && !distanceMiles?.toFixed(1)
                  ? 'Add User Location in Actions Dropdown to see approximate distance to prospect'
                  : ''
              }
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

          <Divider sx={{ my: 3, width: '100%' }} />

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
