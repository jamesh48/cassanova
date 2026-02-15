import { Box, Dialog, Divider, Typography } from '@mui/material'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
import MobileMoveProspectDialogContents from '@/features/mobile-user-harems/MobileMoveProspectDialogContents'
import ListedProspectActionBar from '@/features/prospect/ListedProspectActionBar'
import ViewOrEditProspect from '@/features/view-or-edit-prospect'
import { useSnackbar } from '@/hooks'
import {
  useDeleteProspectMutation,
  useUpdateProspectMutation,
} from '@/redux/services'
import type { Harem, Prospect } from '@/types'

dayjs.extend(utc)

interface ListedProspectProps {
  userHaremProspect: Prospect
  handleMoveProspect: (
    targetHaremId: number,
    prospectId: number,
  ) => Promise<void>
  userHarems: Harem[]
  currentHaremId: number
}

const MobileListedProspect = ({
  userHaremProspect,
  handleMoveProspect,
  userHarems,
  currentHaremId,
}: ListedProspectProps) => {
  const showSnackbar = useSnackbar()
  const [moveMobileProspectMode, setMoveMobileProspectMode] = useState(false)
  const [viewProspectDetailMode, setViewProspectDetailMode] = useState(false)

  const [triggerUpdateProspect] = useUpdateProspectMutation()
  const [triggerDeleteProspect] = useDeleteProspectMutation()

  const handleUpdateListedProspect = async (updatedProspect: Prospect) => {
    try {
      await triggerUpdateProspect(updatedProspect).unwrap()
    } catch (_err) {
      showSnackbar('Failed to update Prospect', { variant: 'error' })
    }
  }

  const handleDeleteListedProspect = async () => {
    try {
      await triggerDeleteProspect({ id: userHaremProspect.id }).unwrap()
      showSnackbar('Deleted Prospect Successfully', {
        variant: 'success',
      })
      setViewProspectDetailMode(false)
    } catch (_err) {
      showSnackbar('Failed to Delete Prospect', {
        variant: 'error',
      })
    }
  }

  const daysOnDashboard = useMemo(() => {
    const now = dayjs.utc()
    const createdAt = dayjs.utc(userHaremProspect.createdAt)
    const daysDifference = now.diff(createdAt, 'day')

    return daysDifference
  }, [userHaremProspect.createdAt])

  const daysInCurrentHarem = useMemo(() => {
    const now = dayjs.utc()
    const timeInCurrentHarem = dayjs.utc(userHaremProspect.timeInCurrentHarem)
    const daysDifference = now.diff(timeInCurrentHarem, 'day')

    return daysDifference
  }, [userHaremProspect.timeInCurrentHarem])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
            borderColor: 'primary.light',
          },
        }}
      >
        {/* Main content row */}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' gap={1} flex={1}>
            <Typography
              variant='body1'
              fontWeight={500}
              sx={{
                textDecoration: 'underline',
                textUnderlineOffset: '.25rem',
              }}
            >
              {userHaremProspect.name}
            </Typography>
          </Box>

          {/* Action icons */}
          <ListedProspectActionBar
            handleViewProspectDetailMode={() => setViewProspectDetailMode(true)}
            handleSetMoveMobileProspectMode={() =>
              setMoveMobileProspectMode(true)
            }
            prospect={userHaremProspect}
            mobile
          />
        </Box>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Typography variant='caption'>
            Days in Current Harem: {daysInCurrentHarem}
          </Typography>
          <Divider
            orientation='vertical'
            sx={{
              borderWidth: '.5px',
              height: '.75rem',
              borderColor: 'darkgrey',
              marginX: '1rem',
            }}
          />
          <Typography variant='caption'>
            Days on Dashboard: {daysOnDashboard}
          </Typography>
        </Box>
      </Box>
      <Dialog open={moveMobileProspectMode}>
        <MobileMoveProspectDialogContents
          currentHaremId={currentHaremId}
          userHarems={userHarems}
          prospect={userHaremProspect}
          setMoveMobileProspectMode={setMoveMobileProspectMode}
          handleMoveProspect={handleMoveProspect}
        />
      </Dialog>
      <Dialog open={viewProspectDetailMode} maxWidth='sm' fullWidth>
        <ViewOrEditProspect
          defaultValues={userHaremProspect}
          onDelete={handleDeleteListedProspect}
          onUpdate={handleUpdateListedProspect}
          handleClose={() => setViewProspectDetailMode(false)}
        />
      </Dialog>
    </>
  )
}

export default MobileListedProspect
