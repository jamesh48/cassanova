import { InfoOutline } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material'

interface ViewProspectDetailProps {
  label: string
  value: string
  tooltip?: string
}
const ViewProspectDetail = ({
  label,
  value,
  tooltip,
}: ViewProspectDetailProps) => {
  return (
    <Box flex='1'>
      <Box display='flex' gap={1}>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} placement='right'>
            <InfoOutline sx={{ color: 'GrayText', cursor: 'help' }} />
          </Tooltip>
        )}
      </Box>
      <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
        {value || <em style={{ color: 'text.secondary' }}>---</em>}
      </Typography>
    </Box>
  )
}

export default ViewProspectDetail
