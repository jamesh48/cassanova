import {
  DragIndicator,
  MoveDown,
  VisibilityOutlined,
  Whatshot,
  WhatshotOutlined,
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useSnackbar } from '@/hooks'
import { useUpdateProspectMutation } from '@/redux/services'
import type { Prospect } from '@/types'

type BaseProspectActionBarProps = {
  handleViewProspectDetailMode: () => void
  prospect: Prospect
}

type MobileProspectActionBarProps = BaseProspectActionBarProps & {
  mobile: true
  handleSetMoveMobileProspectMode: () => void
}

type DesktopProspectActionBarProps = BaseProspectActionBarProps & {
  mobile?: false
  handleSetIsProspectDraggable: (draggable: boolean) => void
  isDragging: boolean
}

type ListedProspectActionBarProps =
  | MobileProspectActionBarProps
  | DesktopProspectActionBarProps

const ListedProspectActionBar = (props: ListedProspectActionBarProps) => {
  const { handleViewProspectDetailMode, prospect, mobile } = props
  const showSnackbar = useSnackbar()
  const [triggerMarkListedProspectHot] = useUpdateProspectMutation()

  const handleProspectMouseDown = (e: React.MouseEvent) => {
    if (!mobile) {
      e.stopPropagation()
      props.handleSetIsProspectDraggable(true)
    }
  }

  const handleProspectMouseUp = (e: React.MouseEvent) => {
    if (!mobile) {
      e.stopPropagation()
      props.handleSetIsProspectDraggable(false)
    }
  }

  const handleMarkListedProspectHot = async (
    updatedProspect: Prospect,
    hotLead: boolean,
  ) => {
    try {
      await triggerMarkListedProspectHot({
        ...updatedProspect,
        hotLead,
      }).unwrap()
      showSnackbar(`Marked prospect as ${hotLead ? 'hot' : 'not hot'}`, {
        variant: 'success',
      })
    } catch (_err) {
      showSnackbar('Failed to mark prospect as hot', { variant: 'error' })
    }
  }

  return (
    <Box display='flex' alignItems='center' gap={0.5}>
      <IconButton
        size='small'
        onClick={handleViewProspectDetailMode}
        aria-label='View prospect details'
      >
        <VisibilityOutlined fontSize='small' />
      </IconButton>

      <IconButton
        size='small'
        onClick={() => handleMarkListedProspectHot(prospect, !prospect.hotLead)}
        color={prospect.hotLead ? 'error' : 'default'}
        aria-label={prospect.hotLead ? 'Mark as not hot' : 'Mark as hot'}
      >
        {prospect.hotLead ? (
          <Whatshot fontSize='small' />
        ) : (
          <WhatshotOutlined fontSize='small' />
        )}
      </IconButton>

      {mobile ? (
        <IconButton
          onClick={props.handleSetMoveMobileProspectMode}
          aria-label='Move prospect'
          size='small'
        >
          <MoveDown fontSize='small' />
        </IconButton>
      ) : (
        <Box
          onMouseDown={handleProspectMouseDown}
          onMouseUp={handleProspectMouseUp}
          aria-label='Drag to reorder'
          tabIndex={0}
          sx={{
            cursor: props.isDragging ? 'grabbing' : 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          <DragIndicator fontSize='small' />
        </Box>
      )}
    </Box>
  )
}

export default ListedProspectActionBar
