import { PersonAdd } from '@mui/icons-material'
import { Box, IconButton, MenuItem, Select } from '@mui/material'
import type { Harem } from '@/types'

interface SelectMobileHaremFooterProps {
  userHarems?: Harem[]
  activeMobileUserHaremId: number
  setActiveMobileUserHaremId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >
  handleOpenAddProspectDialog: () => void
  currentUserHaremForProspect: Harem
}

const SelectMobileHaremFooter = ({
  activeMobileUserHaremId,
  setActiveMobileUserHaremId,
  userHarems,
  handleOpenAddProspectDialog,
}: SelectMobileHaremFooterProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        p: 1,
      }}
    >
      <Select
        fullWidth
        onChange={(evt) => {
          setActiveMobileUserHaremId(evt.target.value as number)
        }}
        value={activeMobileUserHaremId}
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
        onClick={handleOpenAddProspectDialog}
        aria-label='Add prospect'
      >
        <PersonAdd />
      </IconButton>
    </Box>
  )
}

export default SelectMobileHaremFooter
