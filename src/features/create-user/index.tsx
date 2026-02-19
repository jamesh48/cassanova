'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import { useMobileBrowserCheck, useSnackbar } from '@/hooks'
import { useCreateUserMutation } from '@/redux/services/unprotected'

interface CreateUserFormValues {
  email: string
  password: string
  confirmPassword: string
}

const CreateUser = () => {
  const router = useRouter()
  const { login } = useAuth()
  const showSnackbar = useSnackbar()
  const isMobile = useMobileBrowserCheck()
  const [triggerCreateUser, { isLoading: isLoadingCreateUser }] =
    useCreateUserMutation()

  const handleCreateUser: SubmitHandler<CreateUserFormValues> = async (
    values,
  ) => {
    try {
      const result = await triggerCreateUser({
        email: values.email.trim(),
        password: values.password.trim(),
      }).unwrap()

      login(result.token)

      showSnackbar('Account created successfully!', { variant: 'success' })

      // Small delay to allow user to see success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (err) {
      const typedErr = err as { data?: { error?: string; details?: string[] } }
      const errorMessage = typedErr.data?.details
        ? `${typedErr.data.error}: ${typedErr.data.details.join(', ')}`
        : typedErr.data?.error || 'Failed to create account'
      showSnackbar(errorMessage, { variant: 'error' })
    }
  }

  return (
    <SimpleForm<CreateUserFormValues>
      onSubmit={handleCreateUser}
      title='Create Account'
      subtitle='Sign up to start organizing your prospects'
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
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message:
                'Password must contain uppercase, lowercase, number, and special character',
            },
          },
          tooltipProps: {
            title: (
              <>
                Password must contain:
                <br />• At least 8 characters
                <br />• One uppercase letter
                <br />• One lowercase letter
                <br />• One number
                <br />• One special character (!@#$%^&*...)
              </>
            ),
            placement: isMobile ? 'top' : 'right',
            arrow: true,
          },
        },
        {
          label: 'Confirm Password',
          name: 'confirmPassword',
          inputType: 'password',
          rules: {
            required: 'Please confirm your password',
            validate: (value, formValues) =>
              value === formValues.password || 'Passwords do not match',
          },
        },
      ]}
      defaultValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      actionButtonProps={{
        variant: 'contained',
        children: 'Create Account',
        loading: isLoadingCreateUser,
        disabled: isLoadingCreateUser,
      }}
      secondaryButtonProps={{
        variant: 'outlined',
        children: 'Back to Login',
        onClick: () => router.push('/login'),
      }}
      linkProps={{
        href: '/login',
        children: 'Already have an account? Sign in',
      }}
      showSnackbar={false}
    />
  )
}

export default CreateUser
