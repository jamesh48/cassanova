'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useCreateUserMutation } from '@/redux/services/unprotected'
import type { User } from '@/types'

const CreateUser = () => {
  const router = useRouter()

  const [triggerCreateUser] = useCreateUserMutation()
  const handleCreateUser: SubmitHandler<User> = async (values) => {
    const result = await triggerCreateUser({ email: values.email }).unwrap()

    localStorage.setItem('authToken', result.token)
    router.push('/')
  }

  return (
    <SimpleForm<User>
      onSubmit={handleCreateUser}
      title='Create User'
      inputs={[
        { label: 'New User Email', component: 'textfield', name: 'email' },
      ]}
      defaultValues={{ email: '' }}
      actionButtonProps={{ variant: 'contained', children: 'Submit' }}
      secondaryButtonProps={{
        variant: 'outlined',
        children: 'Close',
        href: '/login',
      }}
      showSnackbar={false}
    />
  )
}

export default CreateUser
