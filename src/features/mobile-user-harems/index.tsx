import { useCallback } from 'react'
import MobileUserHarem from '@/features/mobile-user-harems/MobileUserHarem'
import { useSnackbar } from '@/hooks'
import { useMoveProspectMutation } from '@/redux/services'
import type { Harem } from '@/types'

interface MobileUserHaremProps {
  setCurrentMobileUserHarem: React.Dispatch<
    React.SetStateAction<Harem | undefined>
  >
  currentMobileUserHarem?: Harem
  userHarems?: Harem[]
  setCurrentUserHarem: React.Dispatch<React.SetStateAction<Harem | undefined>>
  editHaremsMode: boolean
}
const MobileUserHarems = ({
  currentMobileUserHarem,
  userHarems,
  setCurrentMobileUserHarem,
  setCurrentUserHarem,
  editHaremsMode,
}: MobileUserHaremProps) => {
  const showSnackbar = useSnackbar()
  const [triggerMoveProspect] = useMoveProspectMutation()

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

  return (
    <MobileUserHarem
      userHarem={currentMobileUserHarem}
      userHarems={userHarems}
      setCurrentMobileUserHarem={setCurrentMobileUserHarem}
      onOpenProspect={handleOpenAddProspectDialog}
      handleMoveProspect={handleMoveProspect}
      editHaremsMode={editHaremsMode}
    />
  )
}

export default MobileUserHarems
