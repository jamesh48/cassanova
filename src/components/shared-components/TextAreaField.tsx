import { InfoOutlined } from '@mui/icons-material'
import { Box, InputAdornment, Stack, TextField, Tooltip } from '@mui/material'
import type { KeyboardEvent, RefObject } from 'react'

type TextAreaFieldProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  label: string
  placeholder?: string
  rows?: number
  maxRows?: number
  error?: boolean
  helperText?: string
  inputRef?:
    | RefObject<HTMLInputElement>
    | ((instance: HTMLInputElement | null) => void)
    | null
  fullWidth?: boolean
}

const TextAreaField = ({
  value,
  onChange,
  onSubmit,
  label,
  placeholder,
  rows = 4,
  maxRows = 8,
  error = false,
  helperText,
  inputRef = null,
  fullWidth = true,
}: TextAreaFieldProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Submit on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit?.()
    }
    // Shift+Enter creates a new line (default textarea behavior)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        label={label}
        placeholder={placeholder}
        variant='outlined'
        fullWidth={fullWidth}
        multiline
        rows={rows}
        maxRows={maxRows}
        size='medium'
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position='end'
              sx={{
                alignSelf: 'flex-start',
                mt: 1.5,
                mr: -0.5,
              }}
            >
              <Tooltip
                title={
                  <Stack rowGap={1} padding='.25rem'>
                    <Box>Press Enter to submit</Box>
                    <Box> Press Shift+Enter for new line</Box>
                  </Stack>
                }
                placement='top'
                arrow
              >
                <InfoOutlined
                  sx={{
                    fontSize: 18,
                    color: 'text.secondary',
                    cursor: 'help',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                />
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

export default TextAreaField
