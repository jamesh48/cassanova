'use client'

import { SnackbarProvider } from 'notistack'
import PageContainer from '@/components/page-container'
import CreateUser from '@/features/create-user'

export default function Page() {
  return (
    <SnackbarProvider>
      <PageContainer>
        <CreateUser />
      </PageContainer>
    </SnackbarProvider>
  )
}
