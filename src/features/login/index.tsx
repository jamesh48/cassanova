'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import { useSnackbar } from '@/hooks'
import { useLoginMutation } from '@/redux/services/unprotected'

interface LoginFormValues {
  email: string
  password: string
}

const UserLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  const showSnackbar = useSnackbar()
  const [triggerLogin, { isLoading: isLoadingLogin }] = useLoginMutation()

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const result = await triggerLogin({
        ...values,
        email: values.email.trim(),
        password: values.password.trim(),
      }).unwrap()

      login(result.token)
      router.push('/dashboard')
    } catch (error) {
      const typedErr = error as { data?: { error?: string } }
      showSnackbar(typedErr.data?.error || 'Failed to Login', {
        variant: 'error',
      })
    }
  }

  return (
    <SimpleForm<LoginFormValues>
      onSubmit={onSubmit}
      title='User Login'
      subtitle='Sign in to access your account'
      inputs={[
        {
          label: 'Email',
          name: 'email',
          inputType: 'text',
          rules: {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          },
        },
        {
          label: 'Password',
          name: 'password',
          inputType: 'password',
          rules: {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          },
        },
      ]}
      actionButtonProps={{
        children: 'Login',
        variant: 'contained',
        loading: isLoadingLogin,
        disabled: isLoadingLogin,
      }}
      defaultValues={{ email: '', password: '' }}
      linkProps={{
        href: '/create-user',
        children: "Don't have an account? Create one",
      }}
      showSnackbar={false}
    />
  )
}

export default UserLogin
