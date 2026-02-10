'use client'

import { useRouter } from 'next/navigation'
import type { SubmitHandler } from 'react-hook-form'
import SimpleForm from '@/components/shared-components'
import type { User } from '@/types'

const CreateUser = () => {
  const router = useRouter()
  const handleCreateUser: SubmitHandler<User> = async (values) => {
    const response = await fetch('http://localhost:3030/api/create-user', {
      method: 'POST',
      body: JSON.stringify({ email: values.email }),
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await response.json()

    if (response.ok) {
      localStorage.setItem('authToken', result.token)
      router.push('/')
    }
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
