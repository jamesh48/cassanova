import { Check, DeleteForeverOutlined, EditOutlined } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import MobileListedProspect from '@/features/mobile-user-harems/MobileListedProspect'
import { useFocusableInput, useSnackbar } from '@/hooks'
import {
  useDeleteUserHaremMutation,
  useUpdateHaremMutation,
} from '@/redux/services'
import type { Harem } from '@/types'

interface MobileUserHaremProps {
  activeMobileUserHarem: Harem
  userHarems?: Harem[]
  handleMoveProspect: (
    targetHaremId: number,
    prospectId: number,
  ) => Promise<void>
  editHaremsMode: boolean
}

const MobileUserHarem = ({
  activeMobileUserHarem,
  userHarems,
  handleMoveProspect,
  editHaremsMode,
}: MobileUserHaremProps) => {
  const [editHaremName, setEditHaremName] = useState(activeMobileUserHarem.name)
  const [editHaremMode, setEditHaremMode] = useState(false)
  const showSnackbar = useSnackbar()
  const { setInputRef } = useFocusableInput(!!editHaremMode)
  const [triggerUpdateHarem] = useUpdateHaremMutation()
  const [triggerDeleteHarem] = useDeleteUserHaremMutation()

  const handleSaveHaremEdits = async (updatedHarem: Harem) => {
    try {
      await triggerUpdateHarem({
        ...updatedHarem,
        name: editHaremName,
      }).unwrap()
      setEditHaremMode(false)
      showSnackbar('Renamed Harem Successfully', {
        variant: 'success',
        preventDuplicate: true,
      })
    } catch (_err) {
      showSnackbar('Failed to Rename Harem', {
        variant: 'error',
        preventDuplicate: true,
      })
    }
  }

  const handleDeleteHarem = async () => {
    try {
      if (activeMobileUserHarem?.prospects.length) {
        showSnackbar('Harem must be empty before deletion', {
          variant: 'error',
        })
        return
      }
      if (activeMobileUserHarem?.id) {
        await triggerDeleteHarem({ id: activeMobileUserHarem?.id }).unwrap()
        showSnackbar('Successfully deleted Harem!', { variant: 'success' })
      }
    } catch (_err) {
      showSnackbar('Failed to Delete Harem', { variant: 'error' })
    }
  }

  return (
    <Paper
      elevation={12}
      draggable={false}
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        flex: 1,
        padding: '.5rem',
        transition: 'all 0.2s ease',
        backgroundColor: 'background.paper',
        border: 'none',
        borderColor: 'transparent',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        {editHaremMode ? (
          <Box display='flex' alignItems='center'>
            <IconButton color='error' onClick={() => handleDeleteHarem()}>
              <DeleteForeverOutlined />
            </IconButton>
            <TextField
              slotProps={{ htmlInput: { style: { padding: '.25rem' } } }}
              value={editHaremName}
              onChange={(evt) => setEditHaremName(evt.target.value)}
              inputRef={setInputRef}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter' && activeMobileUserHarem) {
                  handleSaveHaremEdits(activeMobileUserHarem)
                }
              }}
            />
          </Box>
        ) : (
          <Typography variant='h5' style={{ textDecoration: 'underline' }}>
            {activeMobileUserHarem.name}
          </Typography>
        )}

        {editHaremsMode ? (
          <Box display='flex' justifyContent='space-between'>
            {editHaremMode ? (
              <IconButton
                color='success'
                onClick={() => {
                  if (activeMobileUserHarem) {
                    handleSaveHaremEdits(activeMobileUserHarem)
                  }
                }}
              >
                <Check />
              </IconButton>
            ) : (
              <IconButton color='info' onClick={() => setEditHaremMode(true)}>
                <EditOutlined />
              </IconButton>
            )}

            {/* <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <MoveDown />
            </Box> */}
          </Box>
        ) : null}
      </Box>

      {/* Scrollable Prospects List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          // Important for flex scrolling
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
            // Padding for scrollbar
            pr: 0.5,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'divider',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        >
          {activeMobileUserHarem.prospects.length ? (
            activeMobileUserHarem.prospects.map((userHaremProspect) => (
              <Box key={userHaremProspect.id}>
                <MobileListedProspect
                  userHaremProspect={userHaremProspect}
                  handleMoveProspect={handleMoveProspect}
                  userHarems={userHarems || []}
                  currentHaremId={activeMobileUserHarem.id}
                />
              </Box>
            ))
          ) : (
            <Typography variant='h6' color='textDisabled'>
              Empty
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  )
}

export default MobileUserHarem
