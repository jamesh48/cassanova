import { enqueueSnackbar, type OptionsObject } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'

type LatLngTuple = [number, number]

const fetchCoords = async (query: string): Promise<LatLngTuple | null> => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en' } },
  )
  const data = await res.json()
  if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  return null
}

const haversineDistanceMiles = (a: LatLngTuple, b: LatLngTuple): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 3958.8
  const dLat = toRad(b[0] - a[0])
  const dLon = toRad(b[1] - a[1])
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(x))
}

export const useLocationDistance = (location: string, userLocation?: string) => {
  const [coords, setCoords] = useState<LatLngTuple | null>(null)
  const [userCoords, setUserCoords] = useState<LatLngTuple | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location.trim()) {
      setCoords(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        setCoords(await fetchCoords(location))
      } catch {
        // ignore geocoding errors silently
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [location])

  useEffect(() => {
    if (!userLocation?.trim()) {
      setUserCoords(null)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setUserCoords(await fetchCoords(userLocation))
      } catch {
        // ignore geocoding errors silently
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [userLocation])

  const distanceMiles =
    coords && userCoords ? haversineDistanceMiles(userCoords, coords) : null

  return { coords, userCoords, loading, distanceMiles }
}

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
