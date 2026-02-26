import type { SubmitHandler } from 'react-hook-form'
import CreateOrEditProspectForm from '@/features/prospect/CreateOrEditProspectForm'
import { useCreateProspectMutation } from '@/redux/services'
import type { Harem, Prospect } from '@/types'

interface NewProspectProps {
  handleCloseProspectDialog: () => void
  currentUserHarem?: Harem
}

const NewProspect = ({
  handleCloseProspectDialog,
  currentUserHarem,
}: NewProspectProps) => {
  const [triggerCreateProspect, { isLoading: isLoadingCreateProspect }] =
    useCreateProspectMutation()

  const handleCreateProspect: SubmitHandler<Prospect> = async (values) => {
    if (currentUserHarem?.id) {
      await triggerCreateProspect({
        ...values,
        haremId: currentUserHarem.id,
      }).unwrap()

      handleCloseProspectDialog()
    }
  }

  return (
    <CreateOrEditProspectForm
      mode='create'
      handleCancel={handleCloseProspectDialog}
      handleSubmit={handleCreateProspect}
      isLoading={isLoadingCreateProspect}
    />
  )
}

export default NewProspect
