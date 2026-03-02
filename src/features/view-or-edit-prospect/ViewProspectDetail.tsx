import { InfoOutline } from '@mui/icons-material'
import { Box, Tooltip, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface ViewProspectDetailProps {
  label: string
  value: string
  tooltip?: string
  actionPanel?: ReactNode[]
}
const ViewProspectDetail = ({
  label,
  value,
  tooltip,
  actionPanel,
}: ViewProspectDetailProps) => {
  return (
    <Box flex='1'>
      <Box display='flex' gap={0.5} alignItems='center'>
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
        {actionPanel && actionPanel.length > 0 && (
          <Box display='flex' gap={1} ml={0.5}>
            {actionPanel}
          </Box>
        )}
      </Box>
      <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
        {value || <em style={{ color: 'text.secondary' }}>---</em>}
      </Typography>
    </Box>
  )
}

export default ViewProspectDetail
