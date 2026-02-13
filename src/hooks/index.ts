import { enqueueSnackbar, type OptionsObject } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useFocusableInput(shouldFocus: boolean) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setInputRef = (instance: HTMLInputElement | null) => {
    inputRef.current = instance
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (shouldFocus) {
      timeout = setTimeout(() => {
        inputRef.current?.focus()
      })
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [shouldFocus])

  return {
    setInputRef,
  }
}

export const useMobileBrowserCheck = () => {
  const [mobileBrowserState, setMobileBrowserState] = useState(false)

  useEffect(() => {
    const mobileBrowserCheck = () => {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ]
      return toMatch.some((toMatchItem) => {
        // Second condition works for iPads that display intel mac...
        return (
          navigator.userAgent.match(toMatchItem) ||
          (navigator.userAgent.indexOf('Macintosh') > -1 &&
            'ontouchend' in document)
        )
      })
    }

    setMobileBrowserState(mobileBrowserCheck())
  }, [])

  return mobileBrowserState
}

export const useSnackbar = () => {
  const mobile = useMobileBrowserCheck()

  const showSnackbar = useCallback(
    (message: string, snackbarProps?: OptionsObject) => {
      return enqueueSnackbar(message, {
        ...snackbarProps,
        autoHideDuration: 1500,
        preventDuplicate: true,
        anchorOrigin: mobile
          ? { vertical: 'top', horizontal: 'center' }
          : { vertical: 'bottom', horizontal: 'left' },
      })
    },
    [mobile],
  )

  return showSnackbar
}
