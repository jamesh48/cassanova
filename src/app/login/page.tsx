'use client'

import { SnackbarProvider } from 'notistack'
import PageContainer from '@/components/page-container'
import UserLogin from '@/features/login'

export default function Page() {
  return (
    <SnackbarProvider>
      <PageContainer>
        <UserLogin />
      </PageContainer>
    </SnackbarProvider>
  )
}
