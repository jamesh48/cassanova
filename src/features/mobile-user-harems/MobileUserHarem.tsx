import { PersonAdd } from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import MobileListedProspect from '@/features/mobile-user-harems/MobileListedProspect'
import type { Harem } from '@/types'

interface MobileUserHaremProps {
  userHarem?: Harem
  userHarems?: Harem[]
  setCurrentMobileUserHarem: React.Dispatch<
    React.SetStateAction<Harem | undefined>
  >
  onOpenProspect: (selectedHarem: Harem) => void
}
const MobileUserHarem = ({
  userHarem,
  userHarems,
  setCurrentMobileUserHarem,
  onOpenProspect,
}: MobileUserHaremProps) => {
  return (
    <Paper
      elevation={12}
      draggable={false}
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        flex: 1,
        padding: '.5rem',
        transition: 'all 0.2s ease',
        backgroundColor: 'background.paper',
        border: 'none',
        borderColor: 'transparent',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h5' style={{ textDecoration: 'underline' }}>
          {userHarem?.name}
        </Typography>
      </Box>

      {/* Scrollable Prospects List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0, // Important for flex scrolling
          overflow: 'auto',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
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
          {userHarem?.prospects.length ? (
            userHarem.prospects.map((userHaremProspect, prospectIndex) => (
              <Box key={userHaremProspect.id}>
                <MobileListedProspect
                  userHaremProspect={userHaremProspect}
                  prospectIndex={prospectIndex}
                />
              </Box>
            ))
          ) : (
            <Typography variant='h6' color='textDisabled'>
              Empty
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Footer - Fixed at bottom */}
      <Box sx={{ mt: 1, pt: 1 }}>
        <Divider sx={{ width: '100%', mb: 1 }} />
        <Box width='100%' display='flex' justifyContent='space-between'>
          <Select
            fullWidth
            onChange={(evt) => {
              const value = evt.target.value
              const foundHarem = userHarems?.find(
                (eligibleHarem) => eligibleHarem.id === value,
              )
              if (foundHarem) {
                setCurrentMobileUserHarem(foundHarem)
              }
            }}
            value={userHarem?.id ?? ''}
            displayEmpty
          >
            {userHarems?.map((eligibleHarem) => (
              <MenuItem key={eligibleHarem.id} value={eligibleHarem.id}>
                {eligibleHarem.name || 'Unnamed'}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            color='success'
            onClick={() => {
              if (userHarem) {
                onOpenProspect(userHarem)
              }
            }}
          >
            <PersonAdd />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default MobileUserHarem
