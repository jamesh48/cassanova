import { DeleteForeverOutlined, Save } from '@mui/icons-material'
import type { SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import SimpleForm from '@/components/shared-components'
import type { Prospect } from '@/types'

interface CreateOrEditProspectFormBaseProps {
  handleSubmit: SubmitHandler<Prospect>
  handleCancel: () => void
  isLoading: boolean
}

type CreateProspectFormProps = CreateOrEditProspectFormBaseProps & {
  mode: 'create'
  prospectValues?: never
  handleDelete?: never
}

type EditProspectFormProps = CreateOrEditProspectFormBaseProps & {
  mode: 'edit'
  prospectValues: Prospect
  handleDelete: () => Promise<void>
}

type CreateOrEditProspectFormProps =
  | CreateProspectFormProps
  | EditProspectFormProps

const CreateOrEditProspectForm = ({
  mode,
  handleSubmit,
  handleDelete,
  prospectValues,
  handleCancel,
  isLoading,
}: CreateOrEditProspectFormProps) => {
  return (
    <SimpleForm<Prospect>
      closeable
      handleClose={handleCancel}
      title={mode === 'create' ? 'Create Prospect' : 'Edit Prospect'}
      onSubmit={handleSubmit}
      inputs={[
        {
          name: 'name',
          inputType: 'text',
          label: 'Name',
          rules: { required: 'Name is required' },
        },
        {
          name: 'age',
          inputType: 'text',
          label: 'Prospect Age',
          rules: { required: false },
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
          .transform((_value, originalValue) => {
            // Remove commas and convert to number
            return originalValue === ''
              ? null
              : Number(String(originalValue).replace(/,/g, ''))
          })
          .nullable()
          .typeError('"Age" should be a positive number')
          .min(18, 'This app is for adults')
          .label('Age'),
        occupation: yup.string().optional(),
        notes: yup.string().optional(),
      })}
      secondaryButtonProps={{
        children: mode === 'create' ? 'Cancel' : 'Cancel Edits',
        onClick: handleCancel,
      }}
      actionButtonProps={{
        children: (
          <>
            <Save sx={{ mr: 1 }} />
            Save
          </>
        ),
        loading: isLoading,
      }}
      deleteButtonProps={
        mode === 'edit'
          ? {
              children: (
                <>
                  <DeleteForeverOutlined sx={{ mr: 1 }} />
                  Delete Prospect
                </>
              ),
              onClick: handleDelete,
              confirmationTitle: 'Delete Prospect?',
              confirmationMessage: `Are you sure you want to delete ${prospectValues.name}? This action cannot be undone.`,
            }
          : undefined
      }
      defaultValues={prospectValues}
      fullWidth
      snackbarProps={{
        successMessage:
          mode === 'create'
            ? 'Prospect created successfully'
            : 'Prospect updated successfully',
        failureMessage:
          mode === 'create'
            ? 'Failed to create prospect'
            : 'Failed to update prospect',
      }}
    />
  )
}

export default CreateOrEditProspectForm
