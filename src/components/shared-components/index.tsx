import {
  Box,
  Button,
  type ButtonProps,
  TextField,
  Typography,
} from '@mui/material'
import Link, { type LinkProps } from 'next/link'

import type { ReactNode } from 'react'
import {
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from 'react-hook-form'
import { useFocusableInput, useSnackbar } from '@/hooks'

type SimpleFormPropsBase<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>
  title: string
  inputs: { component: 'textfield'; label: string; name: Path<T> }[]
  actionButtonProps: ButtonProps
  secondaryButtonProps?: ButtonProps
  defaultValues?: DefaultValues<T>
  linkProps?: LinkProps & { children: ReactNode }
  fullWidth?: boolean // New prop to control width behavior
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
  inputs,
  actionButtonProps,
  secondaryButtonProps,
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

  const handleLocalOnSubmitFailure: SubmitErrorHandler<T> = (_errors) => {}

  return (
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
        <Typography variant='h5' component='h2' fontWeight={600} mb={1}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {inputs.map((input, idx) => (
            <Controller
              key={input.name}
              name={input.name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={idx === 0 ? setInputRef : null}
                  label={input.label}
                  variant='outlined'
                  fullWidth
                  size='medium'
                />
              )}
            />
          ))}
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
              sx={{ flex: 1, ...secondaryButtonProps.sx }}
            />
          )}

          <Button
            {...actionButtonProps}
            type='submit'
            variant={actionButtonProps.variant || 'contained'}
            sx={{ flex: 1, ...actionButtonProps.sx }}
          />
        </Box>

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
  )
}

export default SimpleForm
