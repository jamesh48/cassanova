'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import { useAuth } from '@/contexts/auth-context'
import type { User } from '@/types'

const UserLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const response = await fetch('http://localhost:3030/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        login(result.token)
        router.push('/dashboard')
      }
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
