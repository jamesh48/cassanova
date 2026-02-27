import type { SxProps } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'

// 'live': each tag is submitted immediately (e.g. tagging an existing record)
// 'form': tags are appended and accumulated as part of a form submission
type MultiComboBoxMode = 'live' | 'form'

interface MultiComboBoxProps {
  options: string[]
  label: string
  onSubmit: (newTag: string) => Promise<void>
  value?: string[]
  mode?: MultiComboBoxMode
  handleDelete: (tagName: string) => Promise<void>
  sx?: SxProps
}

const MultiComboBox = ({
  options,
  label,
  onSubmit,
  value,
  mode = 'form',
  handleDelete,
  sx,
}: MultiComboBoxProps) => {
  const handleSubmitLocal = (newValue: string[]) => {
    const newTag = newValue.find((tag) => !value?.includes(tag))
    if (newTag) onSubmit(newTag)
  }

  const isLive = mode === 'live'

  return (
    <Box>
      <Autocomplete
        sx={sx}
        multiple
        freeSolo
        disableClearable
        options={options}
        value={value}
        onChange={(_, newValue) => handleSubmitLocal(newValue)}
        renderTags={isLive ? () => null : undefined}
        renderValue={
          isLive
            ? undefined
            : (value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    size='small'
                    onDelete={() => handleDelete(option)}
                  />
                ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={
              isLive || value?.length === 0 ? 'Search or type to add...' : ''
            }
            variant='outlined'
          />
        )}
      />
      {isLive && value && value.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            paddingTop: '1rem',
          }}
        >
          {value.map((option) => (
            <Chip
              key={option}
              label={option}
              size='small'
              onDelete={() => handleDelete(option)}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default MultiComboBox
