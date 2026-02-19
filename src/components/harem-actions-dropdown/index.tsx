'use client'

import { Add, Edit, ExpandMore, Logout } from '@mui/icons-material'
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useGetCurrentUserQuery } from '@/redux/services'

interface HaremActionsDropdownProps {
  onNewHarem: () => void
  onEditHarems: () => void
  onLogout: () => void
  editHaremsMode?: boolean
}

export default function HaremActionsDropdown({
  onNewHarem,
  onEditHarems,
  onLogout,
  editHaremsMode = false,
}: HaremActionsDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: currentUser } = useGetCurrentUserQuery()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (action: () => void) => {
    action()
    handleClose()
  }

  return (
    <>
      <Button
        variant='contained'
        onClick={handleClick}
        endIcon={<ExpandMore />}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Actions
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>{currentUser?.email || '---'}</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(onNewHarem)}>
          <ListItemIcon>
            <Add fontSize='small' />
          </ListItemIcon>
          <ListItemText>New Harem</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick(onEditHarems)}
          selected={editHaremsMode}
        >
          <ListItemIcon>
            <Edit
              fontSize='small'
              color={editHaremsMode ? 'primary' : 'inherit'}
            />
          </ListItemIcon>
          <ListItemText
            primary={editHaremsMode ? 'Done Editing' : 'Edit Harems'}
          />
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(onLogout)}>
          <ListItemIcon>
            <Logout fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
