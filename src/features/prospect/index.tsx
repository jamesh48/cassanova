import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'

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
  const [triggerCreateProspect] = useCreateProspectMutation()

  const handleCreateProspect: SubmitHandler<Prospect> = async (values) => {
    if (currentUserHarem?.id) {
      triggerCreateProspect({
        name: values.name,
        haremId: currentUserHarem.id,
      }).unwrap()

      handleCloseProspectDialog()
    }
  }

  return (
    <SimpleForm<Prospect>
      onSubmit={handleCreateProspect}
      defaultValues={{ haremId: -1, name: '' }}
      title={`New Prospect - ${currentUserHarem?.name}`}
      inputs={[
        {
          name: 'name',
          label: 'Prospect Name',
          inputType: 'text',
        },
      ]}
      fullWidth
      secondaryButtonProps={{
        children: 'Close',
        onClick: handleCloseProspectDialog,
      }}
      actionButtonProps={{ children: 'Create Prospect' }}
      showSnackbar
      snackbarProps={{
        successMessage: 'Successfully Created Prospect!',
        failureMessage: 'Failed to Create Prospect',
      }}
    />
  )
}

export default NewProspect
