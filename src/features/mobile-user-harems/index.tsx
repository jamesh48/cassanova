import { Box, Divider } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import MobileUserHarem from '@/features/mobile-user-harems/MobileUserHarem'
import SelectMobileHaremFooter from '@/features/user-harems/mobile/SelectMobileHaremFooter'
import { useSnackbar } from '@/hooks'
import { useMoveProspectMutation } from '@/redux/services'
import type { Harem } from '@/types'

interface MobileUserHaremProps {
  setCurrentUserHaremForProspect: React.Dispatch<
    React.SetStateAction<Harem | undefined>
  >
  userHarems?: Harem[]
  editHaremsMode: boolean
}

const MobileUserHarems = ({
  userHarems,
  editHaremsMode,
  setCurrentUserHaremForProspect,
}: MobileUserHaremProps) => {
  const showSnackbar = useSnackbar()
  const [triggerMoveProspect] = useMoveProspectMutation()

  const [activeMobileUserHaremId, setActiveMobileUserHaremId] = useState<
    number | undefined
  >()

  const activeMobileUserHarem = useMemo(() => {
    if (!activeMobileUserHaremId || !userHarems) return userHarems?.[0]
    return (
      userHarems.find((h) => h.id === activeMobileUserHaremId) || userHarems[0]
    )
  }, [activeMobileUserHaremId, userHarems])

  const handleOpenAddProspectDialog = useCallback(() => {
    setCurrentUserHaremForProspect(activeMobileUserHarem)
  }, [setCurrentUserHaremForProspect, activeMobileUserHarem])

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

  if (!activeMobileUserHarem) return null

  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='100%'
      sx={{
        // Prevent any scrolling at this level
        overflow: 'hidden',
      }}
    >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <MobileUserHarem
          activeMobileUserHarem={activeMobileUserHarem}
          userHarems={userHarems}
          handleMoveProspect={handleMoveProspect}
          editHaremsMode={editHaremsMode}
        />
      </Box>

      {/* Fixed bottom controls */}
      <Box
        sx={{
          flexShrink: 0,
          pb: 'max(8px, env(safe-area-inset-bottom))',
        }}
      >
        <Divider />

        <SelectMobileHaremFooter
          activeMobileUserHaremId={activeMobileUserHarem.id}
          userHarems={userHarems}
          currentUserHaremForProspect={activeMobileUserHarem}
          setActiveMobileUserHaremId={setActiveMobileUserHaremId}
          handleOpenAddProspectDialog={handleOpenAddProspectDialog}
        />
      </Box>
    </Box>
  )
}

export default MobileUserHarems
