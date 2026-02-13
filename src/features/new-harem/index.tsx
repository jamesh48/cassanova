import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'

import { useCreateUserHaremMutation } from '@/redux/services'

interface NewHaremProps {
  handleCloseAddHaremDialog: () => void
}

interface NewHaremFormValues {
  name: string
}

const NewHarem = ({ handleCloseAddHaremDialog }: NewHaremProps) => {
  const [triggerCreateHarem] = useCreateUserHaremMutation()

  const handleCreateHarem: SubmitHandler<NewHaremFormValues> = async (
    values,
  ) => {
    await triggerCreateHarem({ name: values.name }).unwrap()
    handleCloseAddHaremDialog()
  }

  return (
    <SimpleForm<NewHaremFormValues>
      onSubmit={handleCreateHarem}
      defaultValues={{ name: '' }}
      title='Create Harem'
      subtitle='Create a new harem to organize your prospects'
      inputs={[
        {
          name: 'name',
          label: 'Harem Name',
          inputType: 'text',
          rules: {
            required: 'Harem name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: 50,
              message: 'Name must be less than 50 characters',
            },
          },
        },
      ]}
      fullWidth
      secondaryButtonProps={{
        children: 'Cancel',
        onClick: handleCloseAddHaremDialog,
      }}
      actionButtonProps={{ children: 'Create Harem' }}
      showSnackbar
      snackbarProps={{
        successMessage: 'Successfully Created New Harem!',
        failureMessage: 'Failed to Create Harem',
      }}
    />
  )
}

export default NewHarem
