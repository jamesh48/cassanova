import MobileUserHarem from '@/features/mobile-user-harems/MobileUserHarem'
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

  return (
    <MobileUserHarem
      userHarem={currentMobileUserHarem}
      userHarems={eligibleUserHarems}
      setCurrentMobileUserHarem={setCurrentMobileUserHarem}
      onOpenProspect={handleOpenAddProspectDialog}
    />
  )
}

export default MobileUserHarems
