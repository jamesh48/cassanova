import {
  Check,
  DeleteForeverOutlined,
  DragIndicator,
  EditOutlined,
  Whatshot,
  WhatshotOutlined,
} from '@mui/icons-material'
import { Box, Divider, IconButton, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
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
}

const MobileListedProspect = ({ userHaremProspect }: ListedProspectProps) => {
  const showSnackbar = useSnackbar()
  const [editListedProspectMode, setEditListedProspectMode] = useState(false)
  const [editListedProspectValue, setEditListedProspectValue] = useState(
    userHaremProspect.name,
  )
  const [triggerMarkListedProspectHot] = useUpdateProspectMutation()
  const [triggerUpdateProspect] = useUpdateProspectMutation()
  const [triggerDeleteProspect] = useDeleteProspectMutation()

  const handleMarkListedProspectHot = async (
    updatedProspect: Prospect,
    hotLead: boolean,
  ) => {
    try {
      await triggerMarkListedProspectHot({
        ...updatedProspect,
        hotLead,
      }).unwrap()
      showSnackbar(`Marked Prospect as ${hotLead ? 'Hot' : 'not Hot'}`, {
        variant: 'success',
      })
    } catch (_err) {
      showSnackbar('Failed to Mark Prospect as Hot', { variant: 'error' })
    }
  }

  const handleUpdateListedProspectName = async (updatedProspect: Prospect) => {
    try {
      await triggerUpdateProspect({
        ...updatedProspect,
        name: editListedProspectValue,
      }).unwrap()
      setEditListedProspectMode(false)
      showSnackbar('Renamed Prospect Successfully', {
        variant: 'success',
      })
    } catch (_err) {
      showSnackbar('Failed to rename Prospect', { variant: 'error' })
    }
  }

  const handleDeleteListedProspect = async () => {
    try {
      await triggerDeleteProspect({ id: userHaremProspect.id }).unwrap()
      showSnackbar('Deleted Prospect Successfully', {
        variant: 'success',
      })
      setEditListedProspectMode(false)
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
    <Box
      draggable={false}
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
        {editListedProspectMode ? (
          <Box display='flex' alignItems='center' gap={1} flex={1}>
            <IconButton
              size='small'
              color='error'
              onClick={handleDeleteListedProspect}
            >
              <DeleteForeverOutlined fontSize='small' />
            </IconButton>
            <TextField
              size='small'
              fullWidth
              slotProps={{ htmlInput: { style: { padding: '.25rem' } } }}
              onChange={(evt) => setEditListedProspectValue(evt.target.value)}
              value={editListedProspectValue}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') {
                  handleUpdateListedProspectName(userHaremProspect)
                }
              }}
            />
          </Box>
        ) : (
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
        )}
        {/* Action icons */}
        <Box display='flex' alignItems='center' gap={0.5}>
          {editListedProspectMode ? (
            <IconButton
              size='small'
              color='success'
              onClick={() => handleUpdateListedProspectName(userHaremProspect)}
            >
              <Check fontSize='small' />
            </IconButton>
          ) : (
            <IconButton
              size='small'
              onClick={() => setEditListedProspectMode(true)}
            >
              <EditOutlined fontSize='small' />
            </IconButton>
          )}

          <IconButton
            size='small'
            onClick={() =>
              handleMarkListedProspectHot(
                userHaremProspect,
                !userHaremProspect.hotLead,
              )
            }
            color={userHaremProspect.hotLead ? 'error' : 'default'}
          >
            {userHaremProspect.hotLead ? (
              <Whatshot fontSize='small' />
            ) : (
              <WhatshotOutlined fontSize='small' />
            )}
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <DragIndicator fontSize='small' />
          </Box>
        </Box>
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
  )
}

export default MobileListedProspect
