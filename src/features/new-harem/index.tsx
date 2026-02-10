import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'

import { useCreateUserHaremMutation } from '@/redux/services'
import type { Harem } from '@/types'

interface NewHaremProps {
  handleCloseAddHaremDialog: () => void
}

const NewHarem = ({ handleCloseAddHaremDialog }: NewHaremProps) => {
  const [triggerCreateHarem] = useCreateUserHaremMutation()

  const handleCreateHarem: SubmitHandler<Harem> = async (values) => {
    await triggerCreateHarem({ name: values.name }).unwrap()
    handleCloseAddHaremDialog()
  }

  return (
    <SimpleForm<Harem>
      onSubmit={handleCreateHarem}
      defaultValues={{ name: '' }}
      title='Create Harem'
      inputs={[{ name: 'name', label: 'Harem Name', component: 'textfield' }]}
      actionButtonProps={{ children: 'Submit' }}
      fullWidth
      secondaryButtonProps={{
        children: 'Close',
        onClick: handleCloseAddHaremDialog,
      }}
      snackbarProps={{
        successMessage: 'Successfully Created New Harem!',
        failureMessage: 'Failed to Create Harem',
      }}
    />
  )
}

export default NewHarem
