import { Box } from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from '@/hooks'
import {
  useMoveProspectMutation,
  useReorderHaremsMutation,
  useReorderProspectsMutation,
} from '@/redux/services'
import type { Harem, Prospect } from '@/types'
import UserHarem from './user-harem'

interface UserHaremsProps {
  userHarems?: Harem[]
  setCurrentUserHarem: React.Dispatch<React.SetStateAction<Harem | undefined>>
  editHaremsMode: boolean
}

const UserHarems = ({
  userHarems,
  setCurrentUserHarem,
  editHaremsMode,
}: UserHaremsProps) => {
  const showSnackbar = useSnackbar()
  const [triggerReorderHarems] = useReorderHaremsMutation()

  const [draggedHaremIndex, setDraggedHaremIndex] = useState<number | null>(
    null,
  )
  const [isDraggingHarem, setIsDraggingHarem] = useState(false)
  const [draggedProspectId, setDraggedProspectId] = useState<number | null>(
    null,
  )
  const [draggedProspectHaremId, setDraggedProspectHaremId] = useState<
    number | null
  >(null)

  const [localHarems, setLocalHarems] = useState<Harem[]>([])

  const handleHaremDragStart = (index: number) => {
    setDraggedHaremIndex(index)
    setIsDraggingHarem(true)
    // Initialize local state with current harems
    setLocalHarems(userHarems || [])
  }

  const handleHaremDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedHaremIndex === null || draggedHaremIndex === index) return

    const newHarems = [...localHarems]
    const draggedItem = newHarems[draggedHaremIndex]
    newHarems.splice(draggedHaremIndex, 1)
    newHarems.splice(index, 0, draggedItem)

    setLocalHarems(newHarems)
    setDraggedHaremIndex(index)
  }

  const handleHaremDragEnd = () => {
    setIsDraggingHarem(false)
    if (draggedHaremIndex !== null) {
      handleReorderHarems(localHarems)
      setDraggedHaremIndex(null)
    }
    setLocalHarems([]) // Clear local state
  }

  const handleReorderHarems = async (reorderedHarems: Harem[]) => {
    const harems = reorderedHarems.map((harem, index) => ({
      id: harem.id,
      order: index + 1,
      name: harem.name,
    }))

    try {
      await triggerReorderHarems(harems).unwrap()
      showSnackbar('Successfully Reordered Harems!', { variant: 'success' })
    } catch (_err) {
      showSnackbar('Failed to Reorder Harems', { variant: 'error' })
    }
  }

  const handleProspectDragStart = (prospectId: number, haremId: number) => {
    setDraggedProspectId(prospectId)
    setDraggedProspectHaremId(haremId)
  }

  const [triggerMoveProspect] = useMoveProspectMutation()

  const handleProspectDrop = async (targetHaremId: number) => {
    if (draggedProspectId === null) return

    try {
      await triggerMoveProspect({
        prospectId: draggedProspectId,
        newHaremId: targetHaremId,
      }).unwrap()

      showSnackbar('Moved Prospect Successfully', {
        variant: 'success',
      })
    } catch (_err) {
      showSnackbar('Failed to move Prospect', {
        variant: 'error',
      })
    }

    setDraggedProspectId(null)
    setDraggedProspectHaremId(null)
  }

  const [triggerReorderProspects] = useReorderProspectsMutation()

  const handleProspectReorder = async (
    haremId: number,
    reorderedProspects: Prospect[],
  ) => {
    const prospects = reorderedProspects.map((prospect, index) => ({
      ...prospect,
      haremOrder: index,
      newHaremId: haremId,
    }))
    // Disallow Moving hotleads after Cold Leads
    for (let i = 0; i < prospects.length; i++) {
      if (
        prospects[i].hotLead === true &&
        prospects.slice(0, i).some((p) => p.hotLead === false)
      ) {
        showSnackbar('Error: Cannot move hot leads after cold leads', {
          variant: 'error',
        })
        return
      }
    }
    // Validate before sending
    if (prospects.some((p) => !p.id)) {
      console.error('Invalid prospect data:', prospects)
      showSnackbar('Error: Invalid prospect data', { variant: 'error' })
      return
    }

    try {
      await triggerReorderProspects(prospects).unwrap()
      showSnackbar('Reordered Prospects Successfully', {
        variant: 'success',
      })
    } catch (err) {
      const typedErr = err as { error: string }
      showSnackbar(`Error: ${typedErr.error || 'Failed to reorder'}`, {
        variant: 'error',
      })
    }
  }

  const handleProspectDragEnd = () => {
    setDraggedProspectId(null)
    setDraggedProspectHaremId(null)
  }

  const handleOpenAddProspectDialog = (userHarem: Harem) => {
    setCurrentUserHarem(userHarem)
  }

  return (
    <Box
      display='flex'
      gap={2}
      width='100%'
      height='calc(100vh - 64px)'
      sx={{
        // Prevent page scroll
        overflow: 'hidden',
        p: 1,
      }}
    >
      {(isDraggingHarem ? localHarems : userHarems)?.map((userHarem, index) => (
        <UserHarem
          key={userHarem.id}
          index={index}
          userHarem={userHarem}
          draggedHaremIndex={draggedHaremIndex}
          isDraggingHarem={isDraggingHarem}
          draggedProspectId={draggedProspectId}
          draggedProspectHaremId={draggedProspectHaremId}
          onHaremDragStart={handleHaremDragStart}
          onHaremDragOver={handleHaremDragOver}
          onHaremDragEnd={handleHaremDragEnd}
          onProspectDragStart={handleProspectDragStart}
          onProspectDrop={handleProspectDrop}
          onProspectReorder={handleProspectReorder}
          onProspectDragEnd={handleProspectDragEnd}
          onOpenProspect={handleOpenAddProspectDialog}
          editHaremsMode={editHaremsMode}
        />
      ))}
    </Box>
  )
}

export default UserHarems
