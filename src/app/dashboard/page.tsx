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
  const [currentUserHaremForProspect, setCurrentUserHaremForProspect] =
    useState<Harem>()
  const [openHaremDialog, setOpenHaremDialog] = useState(false)
  const [editHaremsMode, setEditHaremsMode] = useState(false)

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

        {/* Navigation Bar - Fixed at top */}
        <AppBar
          position='static'
          color='default'
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            // Prevent AppBar from shrinking
            flexShrink: 0,
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

        {/* Main Content - Scrollable area */}
        <Box
          component='main'
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: isMobile ? 0 : 2,
          }}
        >
          {isMobile ? (
            <MobileUserHarems
              userHarems={userHarems}
              editHaremsMode={editHaremsMode}
              setCurrentUserHaremForProspect={setCurrentUserHaremForProspect}
            />
          ) : (
            <UserHarems
              userHarems={userHarems}
              setCurrentUserHaremForProspect={setCurrentUserHaremForProspect}
              editHaremsMode={editHaremsMode}
            />
          )}
        </Box>

        {/* Dialogs */}
        <Dialog open={!!currentUserHaremForProspect} maxWidth='sm' fullWidth>
          <NewProspect
            currentUserHarem={currentUserHaremForProspect}
            handleCloseProspectDialog={() =>
              setCurrentUserHaremForProspect(undefined)
            }
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
