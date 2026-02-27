import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import MultiComboBox from '@/components/MultiCombobox'
import SimpleForm from '@/components/shared-components'
import {
  useCreateUserTagMutation,
  useDeleteUserTagMutation,
  useGetCurrentUserQuery,
  useGetUserTagsQuery,
  useUpdateUserMutation,
} from '@/redux/services'
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
  const { data: userTags } = useGetUserTagsQuery()
  const [triggerUpdateUser, { isLoading: isLoadingUpdateUser }] =
    useUpdateUserMutation()
  const [triggerCreateUserTag] = useCreateUserTagMutation()
  const [triggerDeleteUserTag] = useDeleteUserTagMutation()
  const handleSubmit: SubmitHandler<UserProfileFormValues> = async (values) => {
    await triggerUpdateUser(values).unwrap()
    handleClose()
  }

  const defaultValues = useMemo(() => {
    return currentUser
  }, [currentUser])

  const handleTagSubmit = async (tagName: string) => {
    await triggerCreateUserTag({ name: tagName }).unwrap()
  }

  const userTagsValue = useMemo(() => {
    return userTags?.map((userTag) => userTag.name)
  }, [userTags])

  const handleDeleteUserTag = async (tagName: string) => {
    const tagToDeleteId = userTags?.find(
      (userTag) => userTag.name === tagName,
    )?.id

    if (tagToDeleteId) {
      await triggerDeleteUserTag({ tagId: tagToDeleteId }).unwrap()
    }
  }

  return (
    <SimpleForm<UserProfileFormValues>
      fullWidth
      title='Edit User Profile'
      closeable
      handleClose={handleClose}
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
        {
          inputType: 'void',
          label: 'User Tags',
          renderAfter: () => (
            <MultiComboBox
              value={userTagsValue || []}
              options={userTagsValue || []}
              label='User Tags'
              onSubmit={handleTagSubmit}
              mode='live'
              handleDelete={handleDeleteUserTag}
            />
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
