import { Box, Button, MenuItem, Select, Typography } from '@mui/material'
import { useState } from 'react'
import type { Harem, Prospect } from '@/types'

interface MobileMoveProspectDialogContentsProps {
  currentHaremId: number
  handleMoveProspect: (
    targetHaremId: number,
    prospectId: number,
  ) => Promise<void>
  prospect: Prospect
  userHarems: Harem[]
  setMoveMobileProspectMode: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMoveProspectDialogContents = ({
  currentHaremId,
  handleMoveProspect,
  prospect,
  userHarems,
  setMoveMobileProspectMode,
}: MobileMoveProspectDialogContentsProps) => {
  const [selectValue, setSelectValue] = useState(currentHaremId)

  const localHandleMoveProspect = async () => {
    await handleMoveProspect(selectValue, prospect.id)
    setMoveMobileProspectMode(false)
    setSelectValue(currentHaremId)
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        margin: '0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          border: 'none',
          borderColor: 'divider',
          borderRadius: 0,
          padding: 3,
          backgroundColor: 'transparent',
          boxShadow: 0,
        }}
      >
        <Typography variant='h5' component='h2' fontWeight={600} mb={1}>
          Move Prospect
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Select
            label='Move to...'
            value={selectValue}
            onChange={(evt) => setSelectValue(evt.target.value)}
          >
            {userHarems.map((userHarem) => (
              <MenuItem key={userHarem.id} value={userHarem.id}>
                {userHarem.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display='flex' justifyContent='space-between' gap={1}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {
              setMoveMobileProspectMode(false)
              setSelectValue(currentHaremId)
            }}
          >
            Close
          </Button>
          <Button variant='contained' onClick={localHandleMoveProspect}>
            Move Prospect
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default MobileMoveProspectDialogContents
