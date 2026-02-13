import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import type { Harem, Prospect } from '@/types'

interface MobileMoveProspectDialogContentsProps {
  currentHaremId: number
  handleMoveProspect: (
    targetHaremId: number,
    prospectId: number,
  ) => Promise<void>
  prospect: Prospect
  userHarems: Harem[]
  setMoveMobileProspectMode: React.Dispatch<React.SetStateAction<boolean>>
}

interface MoveProspectFormValues {
  targetHaremId: number
}

const MobileMoveProspectDialogContents = ({
  currentHaremId,
  handleMoveProspect,
  prospect,
  userHarems,
  setMoveMobileProspectMode,
}: MobileMoveProspectDialogContentsProps) => {
  const handleSubmit: SubmitHandler<MoveProspectFormValues> = async (
    values,
  ) => {
    await handleMoveProspect(values.targetHaremId, prospect.id)
    setMoveMobileProspectMode(false)
  }

  return (
    <SimpleForm<MoveProspectFormValues>
      onSubmit={handleSubmit}
      defaultValues={{ targetHaremId: currentHaremId }}
      title='Move Prospect'
      subtitle={`Move ${prospect.name} to a different harem`}
      inputs={[
        {
          name: 'targetHaremId',
          label: 'Move to',
          inputType: 'select',
          options: userHarems.map((harem) => ({
            value: harem.id,
            label: `${harem.name}${harem.id === currentHaremId ? ' (Current)' : ''}`,
            disabled: harem.id === currentHaremId,
          })),
          rules: {
            validate: (value) =>
              value !== currentHaremId || 'Please select a different harem',
          },
        },
      ]}
      fullWidth
      secondaryButtonProps={{
        children: 'Cancel',
        onClick: () => setMoveMobileProspectMode(false),
      }}
      actionButtonProps={{
        children: 'Move',
      }}
      showSnackbar
      snackbarProps={{
        successMessage: 'Moved Prospect Successfully',
        failureMessage: 'Failed to move Prospect',
      }}
    />
  )
}

export default MobileMoveProspectDialogContents
