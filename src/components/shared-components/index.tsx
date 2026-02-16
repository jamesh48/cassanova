import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  type ButtonProps,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  type TooltipProps,
  Typography,
} from '@mui/material'
import Link, { type LinkProps } from 'next/link'

import { type ReactNode, useState } from 'react'
import {
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from 'react-hook-form'
import TextAreaField from '@/components/shared-components/TextAreaField'
import { useFocusableInput, useSnackbar } from '@/hooks'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'

type BaseInput<T extends FieldValues> = {
  label: string
  name: Path<T>
  tooltipProps?: Omit<TooltipProps, 'children'>
  rules?: RegisterOptions<T, Path<T>>
}

type TextInput<T extends FieldValues> = BaseInput<T> & {
  inputType: 'text' | 'password'
}

type TextAreaInput<T extends FieldValues> = BaseInput<T> & {
  inputType: 'textarea'
  rows?: number
  maxRows?: number
  placeholder?: string
}

type DeleteButtonProps = {
  onClick: () => void
  disabled?: boolean
  startIcon?: React.ReactNode
  children?: React.ReactNode
  confirmationTitle?: string
  confirmationMessage?: string
}

type SelectInput<T extends FieldValues> = BaseInput<T> & {
  inputType: 'select'
  options: { value: string | number; label: string; disabled?: boolean }[]
}

type FormInput<T extends FieldValues> =
  | TextInput<T>
  | TextAreaInput<T>
  | SelectInput<T>

type SimpleFormPropsBase<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>
  title: string
  subtitle?: string
  inputs: FormInput<T>[]
  actionButtonProps: ButtonProps
  secondaryButtonProps?: ButtonProps
  deleteButtonProps?: DeleteButtonProps
  defaultValues?: DefaultValues<T>
  linkProps?: LinkProps & { children: ReactNode }
  fullWidth?: boolean
}

type SimpleFormProps<T extends FieldValues> = SimpleFormPropsBase<T> &
  (
    | {
        showSnackbar?: false
        snackbarProps?: never
      }
    | {
        showSnackbar?: true
        snackbarProps: {
          successMessage: string
          failureMessage: string
        }
      }
  )

const SimpleForm = <T extends FieldValues>({
  onSubmit,
  title,
  subtitle,
  inputs,
  actionButtonProps,
  secondaryButtonProps,
  deleteButtonProps,
  defaultValues,
  linkProps,
  showSnackbar = true,
  snackbarProps = {
    successMessage: 'Success!',
    failureMessage: 'Something went wrong',
  },
  fullWidth = false,
}: SimpleFormProps<T>) => {
  const revealSnackbar = useSnackbar()
  const { handleSubmit, control, reset } = useForm<T>({ defaultValues })
  const { setInputRef } = useFocusableInput(true)

  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  const handleLocalOnSubmitSuccess: SubmitHandler<T> = async (values) => {
    try {
      await onSubmit(values)
      if (showSnackbar && snackbarProps) {
        revealSnackbar(snackbarProps.successMessage, { variant: 'success' })
      }
      reset()
    } catch (_err) {
      if (showSnackbar && snackbarProps) {
        revealSnackbar(snackbarProps.failureMessage, { variant: 'error' })
      }
    }
  }

  const handleLocalOnSubmitFailure: SubmitErrorHandler<T> = (_errors) => {
    // Show first validation error
    const firstError = Object.values(_errors)[0]
    if (firstError?.message) {
      revealSnackbar(firstError.message as string, { variant: 'error' })
    }
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteButtonProps?.onClick) {
      try {
        await deleteButtonProps.onClick()
        setDeleteDialogOpen(false)
      } catch (_err) {
        revealSnackbar('Failed to delete', { variant: 'error' })
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Box
        component='form'
        onSubmit={handleSubmit(
          handleLocalOnSubmitSuccess,
          handleLocalOnSubmitFailure,
        )}
        sx={{
          width: fullWidth ? '100%' : { xs: '90%', sm: '400px', md: '440px' },
          maxWidth: '100%',
          margin: fullWidth ? 0 : '0 auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            border: fullWidth ? 'none' : '1px solid',
            borderColor: 'divider',
            borderRadius: fullWidth ? 0 : 2,
            padding: 3,
            backgroundColor: fullWidth ? 'transparent' : 'background.paper',
            boxShadow: fullWidth ? 0 : 1,
          }}
        >
          {/* Header */}
          <Box>
            <Typography
              variant='h5'
              component='h2'
              fontWeight={600}
              gutterBottom
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='body2' color='text.secondary'>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {inputs.map((input, idx) => {
              const isPasswordField = input.inputType === 'password'
              const isSelectField = input.inputType === 'select'
              const isTextAreaField = input.inputType === 'textarea'
              const fieldName = input.name as string
              const showPassword = passwordVisibility[fieldName] || false

              return (
                <Controller
                  key={input.name}
                  name={input.name}
                  control={control}
                  rules={input.rules}
                  defaultValue={'' as FieldValues[string]}
                  render={({ field, fieldState: { error } }) => {
                    // Select Field
                    if (isSelectField) {
                      const selectInput = input as SelectInput<T>
                      const selectField = (
                        <FormControl fullWidth error={!!error}>
                          <InputLabel id={`${fieldName}-label`}>
                            {input.label}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId={`${fieldName}-label`}
                            id={fieldName}
                            label={input.label}
                            value={field.value ?? ''}
                          >
                            {selectInput.options.map((option) => (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {error?.message && (
                            <Typography
                              variant='caption'
                              color='error'
                              sx={{ mt: 0.5, ml: 1.75 }}
                            >
                              {error.message}
                            </Typography>
                          )}
                        </FormControl>
                      )

                      return input.tooltipProps ? (
                        <Tooltip {...input.tooltipProps}>{selectField}</Tooltip>
                      ) : (
                        selectField
                      )
                    }

                    // TextArea Field
                    if (isTextAreaField) {
                      const textAreaInput = input as TextAreaInput<T>
                      const textAreaField = (
                        <TextAreaField
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onSubmit={handleSubmit(
                            handleLocalOnSubmitSuccess,
                            handleLocalOnSubmitFailure,
                          )}
                          label={input.label}
                          placeholder={textAreaInput.placeholder}
                          rows={textAreaInput.rows || 4}
                          maxRows={textAreaInput.maxRows || 8}
                          error={!!error}
                          helperText={error?.message}
                          inputRef={idx === 0 ? setInputRef : null}
                        />
                      )

                      return input.tooltipProps ? (
                        <Tooltip {...input.tooltipProps}>
                          {textAreaField}
                        </Tooltip>
                      ) : (
                        textAreaField
                      )
                    }
                    // Text/Password Field
                    const textField = (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        type={
                          isPasswordField && !showPassword ? 'password' : 'text'
                        }
                        inputRef={idx === 0 ? setInputRef : null}
                        label={input.label}
                        variant='outlined'
                        fullWidth
                        size='medium'
                        error={!!error}
                        helperText={error?.message}
                        InputProps={
                          isPasswordField
                            ? {
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      aria-label={
                                        showPassword
                                          ? 'hide password'
                                          : 'show password'
                                      }
                                      onClick={() =>
                                        togglePasswordVisibility(fieldName)
                                      }
                                      onMouseDown={(e) => e.preventDefault()}
                                      edge='end'
                                      size='small'
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }
                            : undefined
                        }
                      />
                    )

                    return input.tooltipProps ? (
                      <Tooltip {...input.tooltipProps}>{textField}</Tooltip>
                    ) : (
                      textField
                    )
                  }}
                />
              )
            })}
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 1,
            }}
          >
            {secondaryButtonProps && (
              <Button
                {...secondaryButtonProps}
                variant={secondaryButtonProps.variant || 'outlined'}
                color={secondaryButtonProps.color || 'secondary'}
                sx={{ flex: 1, ...secondaryButtonProps.sx }}
                tabIndex={-1}
              />
            )}

            <Button
              {...actionButtonProps}
              type='submit'
              variant={actionButtonProps.variant || 'contained'}
              sx={{ flex: 1, ...actionButtonProps.sx }}
            />
          </Box>

          {deleteButtonProps && (
            <Box sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant='outlined'
                color='error'
                tabIndex={-1}
                onClick={handleDeleteClick}
                disabled={deleteButtonProps.disabled}
                startIcon={deleteButtonProps.startIcon}
              >
                {deleteButtonProps.children || 'Delete'}
              </Button>
            </Box>
          )}

          {linkProps && (
            <Box
              component={Link}
              {...linkProps}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
                display: 'block',
                transition: 'all 0.2s ease-in-out',
                mt: 0.5,

                '&:hover': {
                  color: 'primary.dark',
                  textDecoration: 'underline',
                },

                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                  borderRadius: '4px',
                },
              }}
            >
              {linkProps.children}
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      {deleteButtonProps && (
        <DeleteConfirmationDialog
          deleteDialogOpen={deleteDialogOpen}
          confirmationTitle={deleteButtonProps.confirmationTitle}
          confirmationMessage={deleteButtonProps.confirmationMessage}
          handleDeleteCancel={handleDeleteCancel}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </>
  )
}

export default SimpleForm
