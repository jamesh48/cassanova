import { Box } from '@mui/material'
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

  // Derive the current harem from userHarems - always fresh from RTK Query cache
  const currentMobileUserHarem = useMemo(() => {
    if (!currentMobileUserHaremId || !userHarems) return userHarems?.[0]
    return (
      userHarems.find((h) => h.id === currentMobileUserHaremId) || userHarems[0]
    )
  }, [currentMobileUserHaremId, userHarems])

  const handleOpenAddProspectDialog = (userHarem: Harem) => {
    setCurrentUserHarem(userHarem)
  }

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

  return currentMobileUserHarem ? (
    <Box
      display='flex'
      gap={2}
      width='100%'
      height='calc(100vh - 64px)'
      sx={{
        overflow: 'hidden',
        p: 1,
      }}
    >
      <MobileUserHarem
        userHarem={currentMobileUserHarem}
        userHarems={userHarems}
        setCurrentMobileUserHaremId={setCurrentMobileUserHaremId}
        onOpenProspect={handleOpenAddProspectDialog}
        handleMoveProspect={handleMoveProspect}
        editHaremsMode={editHaremsMode}
      />
    </Box>
  ) : null
}

export default MobileUserHarems
