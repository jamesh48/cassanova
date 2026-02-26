'use client'

import { Skeleton } from '@mui/material'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import { useLocationDistance } from '@/hooks'

// Fix default marker icons broken by webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)[
  '_getIconUrl'
]
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const userMarkerIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#1976d2;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

type LatLngTuple = [number, number]

const MapController = ({
  center,
  userCoords,
}: {
  center: LatLngTuple
  userCoords?: LatLngTuple | null
}) => {
  const map = useMap()
  const prevCenter = useRef<LatLngTuple | null>(null)
  const prevUserCoords = useRef<LatLngTuple | null>(null)

  useEffect(() => {
    const centerChanged =
      prevCenter.current?.[0] !== center[0] ||
      prevCenter.current?.[1] !== center[1]
    const userChanged =
      prevUserCoords.current?.[0] !== userCoords?.[0] ||
      prevUserCoords.current?.[1] !== userCoords?.[1]

    if (centerChanged || userChanged) {
      if (userCoords) {
        map.fitBounds([center, userCoords], { padding: [40, 40] })
      } else {
        map.setView(center, 13)
      }
      prevCenter.current = center
      prevUserCoords.current = userCoords ?? null
    }
  }, [center, userCoords, map])

  return null
}

interface LocationMapProps {
  location: string
  userLocation?: string
}

const LocationMap = ({ location, userLocation }: LocationMapProps) => {
  const { coords, userCoords, loading, distanceMiles } = useLocationDistance(
    location,
    userLocation,
  )

  if (loading)
    return (
      <Skeleton
        variant='rectangular'
        height={200}
        sx={{ borderRadius: 1, mt: 1 }}
      />
    )

  if (!coords) return null

  return (
    <MapContainer
      center={coords}
      zoom={13}
      style={{ height: 200, width: '100%', borderRadius: 8, marginTop: 8 }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={coords} />
      {userCoords && (
        <>
          <Marker position={userCoords} icon={userMarkerIcon} />
          <Polyline
            positions={[userCoords, coords]}
            color='#1976d2'
            weight={2}
            dashArray='6'
          >
            {distanceMiles !== null && (
              <Tooltip permanent>{distanceMiles.toFixed(1)} mi</Tooltip>
            )}
          </Polyline>
        </>
      )}
      <MapController center={coords} userCoords={userCoords} />
    </MapContainer>
  )
}

export default LocationMap
