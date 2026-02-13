'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import { useSnackbar } from '@/hooks'
import { useCreateUserMutation } from '@/redux/services/unprotected'

type CreateUserForm = {
  email: string
  password: string
  confirmPassword: string
}

const CreateUser = () => {
  const router = useRouter()
  const { login } = useAuth()
  const showSnackbar = useSnackbar()
  const [triggerCreateUser, { isLoading: isLoadingCreateUser }] =
    useCreateUserMutation()

  const handleCreateUser: SubmitHandler<CreateUserForm> = async (values) => {
    try {
      const result = await triggerCreateUser({
        email: values.email,
        password: values.password,
      }).unwrap()

      login(result.token)

      showSnackbar('Account created successfully!', { variant: 'success' })

      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (err) {
      const typedErr = err as { data: { error: string; details?: string[] } }
      const errorMessage = typedErr.data.details
        ? `${typedErr.data.error}: ${typedErr.data.details.join(', ')}`
        : typedErr.data.error
      showSnackbar(errorMessage, { variant: 'error' })
    }
  }

  return (
    <SimpleForm<CreateUserForm>
      onSubmit={handleCreateUser}
      title='Create User'
      inputs={[
        {
          label: 'Email',
          name: 'email',
          inputType: 'text',
          rules: {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
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
            placement: 'right',
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
      }}
      secondaryButtonProps={{
        variant: 'outlined',
        children: 'Back to Login',
        href: '/login',
      }}
      showSnackbar={false}
    />
  )
}

export default CreateUser
