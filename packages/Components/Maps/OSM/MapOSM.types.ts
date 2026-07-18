import type maplibregl from "maplibre-gl";
import type { CSSProperties } from "react";

export interface MapOSMProps {
  lat: number | string;
  lon: number | string;
  onMapPick?: (lat: number | string, lon: number | string) => void;
  height?: string;
  className?: string;
  style?: CSSProperties;
  mapClassName?: string;
  mapStyle?: CSSProperties;
  width?: string;
  interactive?: boolean;
  disable3D?: boolean;
  showNavigationControl?: boolean;
  mapOptions?: Partial<maplibregl.MapOptions>;
}
