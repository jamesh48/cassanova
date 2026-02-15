import { Box, Dialog, Divider, Typography } from '@mui/material'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
import ListedProspectActionBar from '@/features/prospect/ListedProspectActionBar'
import ViewOrEditProspect from '@/features/view-or-edit-prospect'
import { useSnackbar } from '@/hooks'
import {
  useDeleteProspectMutation,
  useUpdateProspectMutation,
} from '@/redux/services'
import type { Prospect } from '@/types'

dayjs.extend(utc)

interface ListedProspectProps {
  userHaremProspect: Prospect
  prospectIndex: number
  onProspectDragStart: (prospectId: number, prospectIndex: number) => void
  onProspectDragEnd: () => void
  isDragging: boolean
}

const ListedProspect = ({
  userHaremProspect,
  onProspectDragStart,
  onProspectDragEnd,
  isDragging,
  prospectIndex,
}: ListedProspectProps) => {
  const [viewProspectDetailMode, setViewProspectDetailMode] = useState(false)
  const showSnackbar = useSnackbar()
  const [isProspectDraggable, setIsProspectDraggable] = useState(false)
  const [triggerUpdateProspect] = useUpdateProspectMutation()
  const [triggerDeleteProspect] = useDeleteProspectMutation()

  const handleUpdateListedProspect = async (updatedProspect: Prospect) => {
    try {
      await triggerUpdateProspect(updatedProspect).unwrap()
    } catch (_err) {
      showSnackbar('Failed to update Prospect', { variant: 'error' })
    }
  }

  const handleDeleteListedProspect = async (prospectId: number) => {
    try {
      await triggerDeleteProspect({ id: prospectId }).unwrap()
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
        draggable={isProspectDraggable}
        onDragStart={(e) => {
          e.stopPropagation()
          onProspectDragStart(userHaremProspect.id, prospectIndex)
        }}
        onDragEnd={(e) => {
          e.stopPropagation()
          onProspectDragEnd()
          setIsProspectDraggable(false)
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          padding: '.5rem',
          borderRadius: '.5rem',
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isDragging ? 'action.selected' : 'background.paper',
          border: '1px solid',
          borderColor: isDragging ? 'primary.main' : 'divider',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: isDragging ? 'action.selected' : 'action.hover',
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
            prospect={userHaremProspect}
            isDragging={isDragging}
            handleSetIsProspectDraggable={(draggable: boolean) =>
              setIsProspectDraggable(draggable)
            }
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

export default ListedProspect
