import type { Metadata } from 'next'
import PageContainer from '@/components/page-container'
import UserLogin from '@/features/login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function Page() {
  return (
    <PageContainer>
      <UserLogin />
    </PageContainer>
  )
}
