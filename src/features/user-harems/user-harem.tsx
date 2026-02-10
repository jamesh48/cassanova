import {
  Check,
  DeleteForeverOutlined,
  DragIndicator,
  EditOutlined,
  PersonAdd,
} from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import ListedProspect from '@/features/user-harems/listed-prospect'
import { useFocusableInput } from '@/hooks'
import {
  useDeleteUserHaremMutation,
  useUpdateHaremMutation,
} from '@/redux/services'
import type { Harem, Prospect } from '@/types'

interface UserHaremProps {
  index: number
  userHarem: Harem
  draggedHaremIndex: number | null
  isDraggingHarem: boolean
  draggedProspectId: number | null
  draggedProspectHaremId: number | null
  onHaremDragStart: (index: number) => void
  onHaremDragOver: (e: React.DragEvent, index: number) => void
  onHaremDragEnd: () => void
  onProspectDragStart: (prospectId: number, haremId: number) => void
  onProspectDrop: (haremId: number) => void
  onProspectReorder: (haremId: number, reorderedProspects: Prospect[]) => void
  onProspectDragEnd: () => void
  onOpenProspect: (harem: Harem) => void
}

const UserHarem = ({
  index,
  userHarem,
  draggedHaremIndex,
  isDraggingHarem,
  draggedProspectId,
  draggedProspectHaremId,
  onHaremDragStart,
  onHaremDragOver,
  onHaremDragEnd,
  onProspectDragStart,
  onProspectDrop,
  onProspectReorder,
  onProspectDragEnd,
  onOpenProspect,
}: UserHaremProps) => {
  const [triggerDeleteHarem] = useDeleteUserHaremMutation()
  const [triggerUpdateHarem] = useUpdateHaremMutation()

  const [editHaremName, setEditHaremName] = useState(userHarem.name)
  const [editHaremMode, setEditHaremMode] = useState(false)

  const [isHaremDraggable, setIsHaremDraggable] = useState(false)
  const [isProspectDragOver, setIsProspectDragOver] = useState(false)
  const [draggedProspectIndex, setDraggedProspectIndex] = useState<
    number | null
  >(null)
  const [isDraggingWithinHarem, setIsDraggingWithinHarem] = useState(false)

  const sortedProspects = useMemo(() => {
    return [...userHarem.prospects].sort((a, b) => {
      if (a.hotLead && !b.hotLead) return -1
      if (!a.hotLead && b.hotLead) return 1
      if (a.haremOrder !== b.haremOrder) {
        return a.haremOrder - b.haremOrder
      }
      return a.id - b.id
    })
  }, [userHarem.prospects])

  const [localProspects, setLocalProspects] =
    useState<Prospect[]>(sortedProspects)

  useEffect(() => {
    if (!isDraggingWithinHarem) {
      setLocalProspects(sortedProspects)
    }
  }, [sortedProspects, isDraggingWithinHarem])

  const handleSaveHaremEdits = async (updatedHarem: Harem) => {
    try {
      await triggerUpdateHarem({
        ...updatedHarem,
        name: editHaremName,
      }).unwrap()
      setEditHaremMode(false)
      enqueueSnackbar<'success'>('Renamed Harem Successfully', {
        variant: 'success',
        preventDuplicate: true,
      })
    } catch (_err) {
      enqueueSnackbar('Failed to Rename Harem', {
        variant: 'error',
        preventDuplicate: true,
      })
    }
  }

  const handleProspectDragOver = (
    e: React.DragEvent,
    prospectIndex?: number,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (draggedProspectHaremId !== userHarem.id) {
      setIsProspectDragOver(true)
      return
    }

    setIsDraggingWithinHarem(true)

    if (
      prospectIndex !== undefined &&
      draggedProspectIndex !== null &&
      draggedProspectIndex !== prospectIndex
    ) {
      const newProspects = [...localProspects]
      const draggedItem = newProspects[draggedProspectIndex]
      newProspects.splice(draggedProspectIndex, 1)
      newProspects.splice(prospectIndex, 0, draggedItem)

      setLocalProspects(newProspects)
      setDraggedProspectIndex(prospectIndex)
    }
  }

  const handleProspectDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsProspectDragOver(false)
  }

  const handleProspectDropOnHarem = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsProspectDragOver(false)
    setIsDraggingWithinHarem(false)

    if (draggedProspectHaremId !== userHarem.id) {
      onProspectDrop(userHarem.id)
    } else {
      onProspectReorder(userHarem.id, localProspects)
    }

    setDraggedProspectIndex(null)
  }

  const handleLocalProspectDragStart = (
    prospectId: number,
    prospectIndex: number,
  ) => {
    setDraggedProspectIndex(prospectIndex)
    setIsDraggingWithinHarem(true)
    onProspectDragStart(prospectId, userHarem.id)
  }

  const handleProspectDragEndLocal = () => {
    setIsDraggingWithinHarem(false)
    setDraggedProspectIndex(null)
    onProspectDragEnd()
  }

  const handleDeleteHarem = async () => {
    try {
      if (userHarem.prospects.length) {
        enqueueSnackbar('Harem must be empty before deletion', {
          variant: 'error',
        })
        return
      }
      await triggerDeleteHarem({ id: userHarem.id }).unwrap()
      enqueueSnackbar('Successfully deleted Harem!', { variant: 'success' })
    } catch (_err) {
      enqueueSnackbar('Failed to Delete Harem', { variant: 'error' })
    }
  }

  const { setInputRef } = useFocusableInput(!!editHaremMode)

  return (
    <Paper
      elevation={draggedHaremIndex === index ? 8 : 12}
      draggable={isHaremDraggable}
      onDragStart={() => onHaremDragStart(index)}
      onDragOver={(e) => {
        if (draggedProspectId !== null) {
          handleProspectDragOver(e)
        } else {
          onHaremDragOver(e, index)
        }
      }}
      onDragLeave={handleProspectDragLeave}
      onDrop={handleProspectDropOnHarem}
      onDragEnd={onHaremDragEnd}
      sx={{
        display: 'flex',
        // Takes full height of parent
        height: '100%',
        flexDirection: 'column',
        flex: 1,
        padding: '.5rem',
        maxWidth: '25%',
        opacity: draggedHaremIndex === index ? 0.5 : 1,
        transform: draggedHaremIndex === index ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        backgroundColor: isProspectDragOver
          ? 'action.hover'
          : 'background.paper',
        border: isProspectDragOver ? '2px dashed' : 'none',
        borderColor: isProspectDragOver ? 'primary.main' : 'transparent',
        '&:hover': {
          boxShadow: isDraggingHarem
            ? undefined
            : '0px 8px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      {/* Header - Fixed */}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        {editHaremMode ? (
          <Box display='flex' alignItems='center'>
            <IconButton color='error' onClick={() => handleDeleteHarem()}>
              <DeleteForeverOutlined />
            </IconButton>
            <TextField
              slotProps={{ htmlInput: { style: { padding: '.25rem' } } }}
              value={editHaremName}
              onChange={(evt) => setEditHaremName(evt.target.value)}
              inputRef={setInputRef}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') {
                  handleSaveHaremEdits(userHarem)
                }
              }}
            />
          </Box>
        ) : (
          <Typography variant='h5' style={{ textDecoration: 'underline' }}>
            {userHarem.name}
          </Typography>
        )}

        <Box display='flex' justifyContent='space-between'>
          {editHaremMode ? (
            <IconButton
              color='success'
              onClick={() => handleSaveHaremEdits(userHarem)}
            >
              <Check />
            </IconButton>
          ) : (
            <IconButton color='info' onClick={() => setEditHaremMode(true)}>
              <EditOutlined />
            </IconButton>
          )}

          <Box
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsHaremDraggable(true)
            }}
            onMouseUp={(e) => {
              e.stopPropagation()
              setIsHaremDraggable(false)
            }}
            sx={{
              cursor: isDraggingHarem ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <DragIndicator />
          </Box>
        </Box>
      </Box>

      {/* Scrollable Prospects List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '50vh', // Critical for flex scrolling
          overflow: 'scroll',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
            overflowY: 'auto',
            flex: 1,
            pr: 0.5, // Padding for scrollbar
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'divider',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        >
          {localProspects.length ? (
            localProspects.map((userHaremProspect, prospectIndex) => (
              <Box
                key={userHaremProspect.id}
                onDragOver={(e) => handleProspectDragOver(e, prospectIndex)}
              >
                <ListedProspect
                  userHaremProspect={userHaremProspect}
                  prospectIndex={prospectIndex}
                  onProspectDragStart={handleLocalProspectDragStart}
                  onProspectDragEnd={handleProspectDragEndLocal}
                  isDragging={draggedProspectId === userHaremProspect.id}
                />
              </Box>
            ))
          ) : (
            <Typography variant='h6' color='textDisabled'>
              Empty
            </Typography>
          )}
        </Stack>

        {/* Footer - Fixed at bottom */}
        <Box sx={{ mt: 1, pt: 1 }}>
          <Divider sx={{ width: '100%', mb: 1 }} />
          <Box width='100%' display='flex' justifyContent='flex-end'>
            <IconButton
              color='success'
              onClick={() => onOpenProspect(userHarem)}
            >
              <PersonAdd />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default UserHarem
