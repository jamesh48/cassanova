import type { SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
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
    <SimpleForm<Prospect>
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
        {
          name: 'age',
          label: 'Prospect Age',
          inputType: 'text',
          rules: {
            required: false,
          },
        },
        {
          name: 'occupation',
          label: 'Prospect Occupation',
          inputType: 'text',
          rules: {
            required: false,
          },
        },
        {
          name: 'location',
          label: 'Prospect Location',
          inputType: 'text',
          rules: { required: false },
        },
        {
          name: 'notes',
          inputType: 'textarea',
          label: 'Notes',
          rows: 4,
          maxRows: 8,
          placeholder: 'Add any notes about this prospect...',
        },
      ]}
      schema={yup.object<Prospect>({
        name: yup.string().required('Name is Required'),
        age: yup
          .number()
          .typeError('Must be a number')
          .min(18, 'This app is for adults')
          .optional(),
        occupation: yup.string().optional(),
        notes: yup.string().optional(),
      })}
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
