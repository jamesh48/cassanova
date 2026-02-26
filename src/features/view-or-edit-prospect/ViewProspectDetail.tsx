import { Box, Typography } from '@mui/material'

interface ViewProspectDetailProps {
  label: string
  value: string
}
const ViewProspectDetail = ({ label, value }: ViewProspectDetailProps) => {
  return (
    <Box flex='1'>
      <Typography
        variant='caption'
        color='text.secondary'
        sx={{
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant='body1' sx={{ mt: 0.5, fontSize: '1.1rem' }}>
        {value || <em style={{ color: 'text.secondary' }}>---</em>}
      </Typography>
    </Box>
  )
}

export default ViewProspectDetail
