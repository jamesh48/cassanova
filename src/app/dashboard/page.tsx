'use client'

import { Add } from '@mui/icons-material'
import { AppBar, Box, Button, Dialog, Toolbar, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { useState } from 'react'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/contexts/auth-context'
import NewHarem from '@/features/new-harem'
import NewProspect from '@/features/prospect'
import UserHarems from '@/features/user-harems'
import { useGetAllHaremsQuery } from '@/redux/services'
import type { Harem } from '@/types'

export default function Dashboard() {
  const { logout } = useAuth()
  const [currentUserHarem, setCurrentUserHarem] = useState<Harem>()
  const [openHaremDialog, setOpenHaremDialog] = useState(false)

  const { data: userHarems } = useGetAllHaremsQuery()

  const handleOpenAddHaremDialog = () => {
    setOpenHaremDialog(true)
  }

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <SnackbarProvider />

        {/* Navigation Bar */}
        <AppBar
          position='static'
          color='default'
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Typography
              variant='h5'
              component='h1'
              fontWeight={600}
              color='text.primary'
            >
              Your Harems
            </Typography>

            <Box display='flex' gap={1.5}>
              <Button
                variant='contained'
                onClick={handleOpenAddHaremDialog}
                startIcon={<Add />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                New Harem
              </Button>
              <Button
                color='error'
                variant='outlined'
                onClick={logout}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component='main'
          sx={{
            flex: 1,
            overflow: 'hidden',
            p: 2,
          }}
        >
          <UserHarems
            userHarems={userHarems}
            setCurrentUserHarem={setCurrentUserHarem}
          />
        </Box>

        {/* Dialogs */}
        <Dialog open={!!currentUserHarem} maxWidth='sm' fullWidth>
          <NewProspect
            currentUserHarem={currentUserHarem}
            handleCloseProspectDialog={() => setCurrentUserHarem(undefined)}
          />
        </Dialog>

        <Dialog open={openHaremDialog} maxWidth='sm' fullWidth>
          <NewHarem
            handleCloseAddHaremDialog={() => setOpenHaremDialog(false)}
          />
        </Dialog>
      </Box>
    </ProtectedRoute>
  )
}
