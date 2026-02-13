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
  eligibleUserHarems?: Harem[]
  setCurrentUserHarem: React.Dispatch<React.SetStateAction<Harem | undefined>>
}
const MobileUserHarems = ({
  currentMobileUserHarem,
  eligibleUserHarems,
  setCurrentMobileUserHarem,
  setCurrentUserHarem,
}: MobileUserHaremProps) => {
  const handleOpenAddProspectDialog = (userHarem: Harem) => {
    setCurrentUserHarem(userHarem)
  }

  const showSnackbar = useSnackbar()

  const [triggerMoveProspect] = useMoveProspectMutation()

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
      userHarems={eligibleUserHarems}
      setCurrentMobileUserHarem={setCurrentMobileUserHarem}
      onOpenProspect={handleOpenAddProspectDialog}
      handleMoveProspect={handleMoveProspect}
    />
  )
}

export default MobileUserHarems
