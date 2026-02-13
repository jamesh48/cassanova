'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import { useSnackbar } from '@/hooks'
import { useLoginMutation } from '@/redux/services/unprotected'
import type { User } from '@/types'

const UserLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  const showSnackbar = useSnackbar()
  const [triggerLogin, { isLoading: isLoadingLogin }] = useLoginMutation()

  const onSubmit: SubmitHandler<User> = async (user) => {
    try {
      const result = await triggerLogin(user).unwrap()

      login(result.token)
      router.push('/dashboard')
    } catch (error) {
      const typedErr = error as { data: { error: string } }
      showSnackbar(typedErr.data.error || 'Failed to Login', {
        variant: 'error',
      })
    }
  }

  return (
    <SimpleForm<User>
      onSubmit={onSubmit}
      title='User Login'
      inputs={[
        { label: 'User Email', name: 'email', inputType: 'text' },
        {
          label: 'Password',
          name: 'password',
          inputType: 'password',
        },
      ]}
      actionButtonProps={{
        children: 'Login',
        variant: 'contained',
        loading: isLoadingLogin,
      }}
      defaultValues={{ email: '', password: '' }}
      linkProps={{
        href: '/create-user',
        children: 'Create User',
      }}
      showSnackbar={false}
    />
  )
}

export default UserLogin
