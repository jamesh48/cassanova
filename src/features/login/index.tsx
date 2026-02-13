'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import { useLoginMutation } from '@/redux/services/unprotected'
import type { User } from '@/types'

const UserLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  const [triggerLogin] = useLoginMutation()

  const onSubmit: SubmitHandler<User> = async (user) => {
    try {
      const result = await triggerLogin(user).unwrap()

      login(result.token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <SimpleForm<User>
      onSubmit={onSubmit}
      title='User Login'
      inputs={[{ label: 'User Email', name: 'email', component: 'textfield' }]}
      actionButtonProps={{ children: 'Login', variant: 'contained' }}
      defaultValues={{ email: '' }}
      linkProps={{
        href: '/create-user',
        children: 'Create User',
      }}
      showSnackbar={false}
    />
  )
}

export default UserLogin
