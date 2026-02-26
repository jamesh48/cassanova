import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import SimpleForm from '@/components/shared-components'
import { useGetCurrentUserQuery, useUpdateUserMutation } from '@/redux/services'
import type { User } from '@/types'

const LocationMap = dynamic(() => import('@/components/location-map'), {
  ssr: false,
})

interface UserProfileFormValues extends Pick<User, 'userLocation'> {}

interface UserProfileFormProps {
  handleClose: () => void
}

const UserProfileForm = ({ handleClose }: UserProfileFormProps) => {
  const { data: currentUser } = useGetCurrentUserQuery()
  const [triggerUpdateUser, { isLoading: isLoadingUpdateUser }] =
    useUpdateUserMutation()

  const handleSubmit: SubmitHandler<UserProfileFormValues> = async (values) => {
    await triggerUpdateUser(values).unwrap()
    handleClose()
  }

  const defaultValues = useMemo(() => {
    return currentUser
  }, [currentUser])

  return (
    <SimpleForm<UserProfileFormValues>
      fullWidth
      title='Edit User Profile'
      inputs={[
        {
          inputType: 'text',
          label: 'User Location',
          name: 'userLocation',
          rules: { required: false },
          renderAfter: (value) => (
            <LocationMap location={(value as string) ?? ''} />
          ),
        },
      ]}
      schema={yup.object().shape({
        userLocation: yup.string().optional(),
      })}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      actionButtonProps={{ children: 'Update', loading: isLoadingUpdateUser }}
      secondaryButtonProps={{ onClick: handleClose, children: 'Close' }}
    />
  )
}

export default UserProfileForm
