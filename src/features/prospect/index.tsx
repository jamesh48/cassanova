import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'

import { useCreateProspectMutation } from '@/redux/services'
import type { Harem } from '@/types'

interface NewProspectProps {
  handleCloseProspectDialog: () => void
  currentUserHarem?: Harem
}

interface NewProspectFormValues {
  name: string
}

const NewProspect = ({
  handleCloseProspectDialog,
  currentUserHarem,
}: NewProspectProps) => {
  const [triggerCreateProspect, { isLoading: isLoadingCreateProspect }] =
    useCreateProspectMutation()

  const handleCreateProspect: SubmitHandler<NewProspectFormValues> = async (
    values,
  ) => {
    if (currentUserHarem?.id) {
      try {
        await triggerCreateProspect({
          name: values.name,
          haremId: currentUserHarem.id,
        }).unwrap()

        handleCloseProspectDialog()
      } catch (_err) {
        // TODO: handle error
      }
    }
  }

  return (
    <SimpleForm<NewProspectFormValues>
      onSubmit={handleCreateProspect}
      defaultValues={{ name: '' }}
      title='New Prospect'
      subtitle={`Add a new prospect to ${currentUserHarem?.name || 'this Harem'}`}
      inputs={[
        {
          name: 'name',
          label: 'Prospect Name',
          inputType: 'text',
          rules: {
            required: 'Prospect name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          },
        },
      ]}
      fullWidth
      secondaryButtonProps={{
        children: 'Cancel',
        onClick: handleCloseProspectDialog,
      }}
      actionButtonProps={{
        children: 'Create',
        loading: isLoadingCreateProspect,
      }}
      showSnackbar
      snackbarProps={{
        successMessage: 'Successfully Created Prospect!',
        failureMessage: 'Failed to Create Prospect',
      }}
    />
  )
}

export default NewProspect
