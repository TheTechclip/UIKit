# MapOSM

**Source:** [`packages/Components/Maps/OSM`](../../../packages/Components/Maps/OSM)

## Purpose

A component (`MapOSM`) that renders a custom interactive map based on OpenStreetMap (OSM) using the `maplibre-gl` library. Provides core map-related UI/UX such as marker display, drag/zoom controls, and coordinate selection (click events).

## Usage Logic

- **`MapOSM`**: Injects `lat` (latitude) and `lon` (longitude) values to set the map's initial center and marker position. Map size is controlled via `width` and `height`.
- When `interactive` mode is enabled, user zoom, panning, and rotation become available.
- Providing the `onMapPick` callback lets you receive the coordinates (latitude, longitude) of the clicked location (usable as a coordinate picker).
- Utility logic in `MapOSM.shared.ts` (`resolveSafeMapStyle`, etc.) safely applies style filters or controls the 3D view.

## Type Signatures

```tsx
// MapOSM.types.ts
import type maplibregl from "maplibre-gl";
import type { CSSProperties } from "react";

export interface MapOSMProps {
  lat: number | string;
  lon: number | string;
  onMapPick?: (lat: number | string, lon: number | string) => void;
  height?: string;
  width?: string;
  className?: string;
  style?: CSSProperties;
  mapClassName?: string;
  mapStyle?: CSSProperties;
  interactive?: boolean; // whether zoom/drag is enabled
  disable3D?: boolean; // disable 3D terrain
  showNavigationControl?: boolean; // show navigation control (top-right zoom control, etc.)
  mapOptions?: Partial<maplibregl.MapOptions>;
}
```

## Example Code

```tsx
import { MapOSM } from "@musecat/uikit";
import { useState } from "react";

export function LocationPicker() {
  const [location, setLocation] = useState({ lat: 37.5665, lon: 126.978 }); // Seoul City Hall default

  return (
    <div style={{ padding: "20px" }}>
      <h3>Select Location</h3>
      <MapOSM
        lat={location.lat}
        lon={location.lon}
        height="500px"
        interactive={true}
        onMapPick={(lat, lon) => {
          console.log(`Selected location: lat ${lat}, lon ${lon}`);
          setLocation({ lat: Number(lat), lon: Number(lon) });
        }}
      />
    </div>
  );
}
```
