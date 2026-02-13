import { PersonAdd } from '@mui/icons-material'
import { Box, Divider, IconButton, MenuItem, Select } from '@mui/material'
import { useCallback, useMemo } from 'react'
import MobileUserHarem from '@/features/mobile-user-harems/MobileUserHarem'
import { useSnackbar } from '@/hooks'
import { useMoveProspectMutation } from '@/redux/services'
import type { Harem } from '@/types'

interface MobileUserHaremProps {
  currentMobileUserHaremId?: number
  setCurrentMobileUserHaremId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >
  userHarems?: Harem[]
  setCurrentUserHarem: React.Dispatch<React.SetStateAction<Harem | undefined>>
  editHaremsMode: boolean
}

const MobileUserHarems = ({
  currentMobileUserHaremId,
  userHarems,
  setCurrentMobileUserHaremId,
  setCurrentUserHarem,
  editHaremsMode,
}: MobileUserHaremProps) => {
  const showSnackbar = useSnackbar()
  const [triggerMoveProspect] = useMoveProspectMutation()

  const currentMobileUserHarem = useMemo(() => {
    if (!currentMobileUserHaremId || !userHarems) return userHarems?.[0]
    return (
      userHarems.find((h) => h.id === currentMobileUserHaremId) || userHarems[0]
    )
  }, [currentMobileUserHaremId, userHarems])

  const handleOpenAddProspectDialog = useCallback(
    (userHarem: Harem) => {
      setCurrentUserHarem(userHarem)
    },
    [setCurrentUserHarem],
  )

  const handleMoveProspect = useCallback(
    async (targetHaremId: number, prospectId: number) => {
      try {
        await triggerMoveProspect({
          prospectId,
          newHaremId: targetHaremId,
        }).unwrap()

        showSnackbar('Moved Prospect Successfully', {
          variant: 'success',
        })
      } catch (_err) {
        showSnackbar('Failed to move Prospect', {
          variant: 'error',
        })
      }
    },
    [showSnackbar, triggerMoveProspect],
  )

  if (!currentMobileUserHarem) return null

  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='calc(100vh - 4rem)'
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
        }}
      >
        <MobileUserHarem
          userHarem={currentMobileUserHarem}
          userHarems={userHarems}
          handleMoveProspect={handleMoveProspect}
          editHaremsMode={editHaremsMode}
        />
      </Box>

      {/* Fixed bottom controls */}
      <Box sx={{ flexShrink: 0 }}>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1,
            mb: 1,
          }}
        >
          <Select
            fullWidth
            onChange={(evt) => {
              setCurrentMobileUserHaremId(evt.target.value as number)
            }}
            value={currentMobileUserHarem.id}
            displayEmpty
          >
            {userHarems?.map((eligibleHarem) => (
              <MenuItem key={eligibleHarem.id} value={eligibleHarem.id}>
                {eligibleHarem.name || 'Unnamed'}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            color='success'
            onClick={() => handleOpenAddProspectDialog(currentMobileUserHarem)}
            aria-label='Add prospect'
          >
            <PersonAdd />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default MobileUserHarems
