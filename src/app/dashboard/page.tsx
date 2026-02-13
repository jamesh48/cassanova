'use client'

import { AppBar, Box, Button, Dialog, Toolbar, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { useState } from 'react'
import HaremActionsDropdown from '@/components/harem-actions-dropdown'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/contexts/auth-context'
import MobileUserHarems from '@/features/mobile-user-harems'
import NewHarem from '@/features/new-harem'
import NewProspect from '@/features/prospect'
import UserHarems from '@/features/user-harems'
import { useMobileBrowserCheck } from '@/hooks'
import { useGetAllHaremsQuery } from '@/redux/services'
import type { Harem } from '@/types'

const Dashboard = () => {
  const { logout } = useAuth()
  const [currentUserHarem, setCurrentUserHarem] = useState<Harem>()
  const [openHaremDialog, setOpenHaremDialog] = useState(false)
  const [editHaremsMode, setEditHaremsMode] = useState(false)
  const [currentMobileUserHaremId, setCurrentMobileUserHaremId] = useState<
    number | undefined
  >()

  const { data: userHarems } = useGetAllHaremsQuery()

  const handleOpenAddHaremDialog = () => {
    setOpenHaremDialog(true)
  }

  const handleEditHarems = () => {
    setEditHaremsMode((prev) => !prev)
  }

  const isMobile = useMobileBrowserCheck()

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
        <SnackbarProvider dense={isMobile} />

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
              noWrap
            >
              {editHaremsMode ? 'Edit Harems' : 'Your Harems'}
            </Typography>

            <Box display='flex' gap={1.5} alignItems='center'>
              {editHaremsMode && (
                <Button
                  variant='outlined'
                  onClick={() => setEditHaremsMode(false)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Done
                </Button>
              )}
              <HaremActionsDropdown
                onNewHarem={handleOpenAddHaremDialog}
                onEditHarems={handleEditHarems}
                onLogout={logout}
                editHaremsMode={editHaremsMode}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component='main'
          sx={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            // Remove padding on mobile
            p: isMobile ? 0 : 2,
          }}
        >
          {isMobile ? (
            <MobileUserHarems
              currentMobileUserHaremId={currentMobileUserHaremId}
              setCurrentMobileUserHaremId={setCurrentMobileUserHaremId}
              userHarems={userHarems}
              setCurrentUserHarem={setCurrentUserHarem}
              editHaremsMode={editHaremsMode}
            />
          ) : (
            <UserHarems
              userHarems={userHarems}
              setCurrentUserHarem={setCurrentUserHarem}
              editHaremsMode={editHaremsMode}
            />
          )}
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

export default Dashboard
