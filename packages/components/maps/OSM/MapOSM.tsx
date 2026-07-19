"use client";

import clsx from "clsx";
import maplibregl from "maplibre-gl";
import View from "../../../frameworks/View/View";
import styles from "./MapOSM.module.scss";
import { resolveSafeMapStyle } from "./MapOSM.style";
import type { MapOSMProps } from "./MapOSM.types";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef } from "react";

const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const DEFAULT_MAP_ZOOM = 16;
const EMPTY_STYLE_IMAGE = {
  width: 1,
  height: 1,
  data: new Uint8Array([0, 0, 0, 0]),
} as const;

function scheduleMapRecenter(
  map: maplibregl.Map,
  center: [number, number],
  zoom = DEFAULT_MAP_ZOOM,
) {
  const recenter = () => {
    map.resize();
    map.jumpTo({ center, zoom });
  };

  recenter();
  window.requestAnimationFrame(() => {
    recenter();
    window.requestAnimationFrame(recenter);
  });
}

export default function MapOSM({
  lat,
  lon,
  onMapPick,
  height = "400px",
  className,
  style,
  mapClassName,
  mapStyle,
  width = "100%",
  interactive = true,
  disable3D = false,
  showNavigationControl = true,
  mapOptions,
}: MapOSMProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const navigationControlRef = useRef<maplibregl.NavigationControl | null>(
    null,
  );
  const hasNavigationControlRef = useRef(false);
  const clickHandlerRef = useRef<
    ((event: maplibregl.MapMouseEvent) => void) | null
  >(null);
  const latestLatRef = useRef(lat);
  const latestLonRef = useRef(lon);
  const latestOnMapPickRef = useRef(onMapPick);

  const bindMapClickHandler = useCallback((map: maplibregl.Map) => {
    if (clickHandlerRef.current) {
      map.off("click", clickHandlerRef.current);
      clickHandlerRef.current = null;
    }

    const handleMapClick = (event: maplibregl.MapMouseEvent) => {
      const { lng, lat: clickedLat } = event.lngLat;
      latestOnMapPickRef.current?.(clickedLat, lng);
    };

    clickHandlerRef.current = handleMapClick;
    map.on("click", handleMapClick);
  }, []);

  useEffect(() => {
    latestLatRef.current = lat;
    latestLonRef.current = lon;
    latestOnMapPickRef.current = onMapPick;
  }, [lat, lon, onMapPick]);

  useEffect(() => {
    let map: maplibregl.Map | null = null;
    if (!mapContainer.current || mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        const response = await fetch(STYLE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.statusText}`);
        }

        const styleJson =
          (await response.json()) as maplibregl.StyleSpecification;
        if (cancelled || !mapContainer.current || mapRef.current) return;

        const latNum = Number(latestLatRef.current) || 37.5326;
        const lonNum = Number(latestLonRef.current) || 127.0246;

        const resolvedStyle = resolveSafeMapStyle(styleJson, disable3D);

        const resolvedMapOptions: maplibregl.MapOptions = {
          container: mapContainer.current,
          style: resolvedStyle,
          center: [lonNum, latNum],
          zoom: DEFAULT_MAP_ZOOM,
          interactive,
          attributionControl: false,
          ...mapOptions,
        };

        map = new maplibregl.Map(resolvedMapOptions);

        map.on("styleimagemissing", ({ id }) => {
          if (!map || map.hasImage(id)) return;

          map.addImage(id, EMPTY_STYLE_IMAGE);
        });

        const marker = new maplibregl.Marker({ color: "#FF0000" })
          .setLngLat([lonNum, latNum])
          .addTo(map);

        map.once("load", () => {
          if (!map) {
            return;
          }

          scheduleMapRecenter(map, [lonNum, latNum]);
        });

        if (disable3D) {
          map.once("load", () => {
            map?.setTerrain(null);
            map?.setPitch(0);
            map?.setMaxPitch(0);
          });
        }

        const navigationControl = new maplibregl.NavigationControl();
        navigationControlRef.current = navigationControl;

        mapRef.current = map;
        markerRef.current = marker;

        if (showNavigationControl) {
          map.addControl(navigationControl, "top-right");
          hasNavigationControlRef.current = true;
        }

        if (interactive) {
          bindMapClickHandler(map);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("MapOSM initialization failed:", err);
        }
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
      markerRef.current = null;
      navigationControlRef.current = null;
      hasNavigationControlRef.current = false;
      clickHandlerRef.current = null;
    };
  }, [
    bindMapClickHandler,
    disable3D,
    interactive,
    mapOptions,
    showNavigationControl,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (interactive) {
      map.scrollZoom.enable();
      map.boxZoom.enable();
      map.dragRotate.enable();
      map.dragPan.enable();
      map.keyboard.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
    } else {
      map.scrollZoom.disable();
      map.boxZoom.disable();
      map.dragRotate.disable();
      map.dragPan.disable();
      map.keyboard.disable();
      map.doubleClickZoom.disable();
      map.touchZoomRotate.disable();
    }

    if (interactive) {
      bindMapClickHandler(map);
    } else if (clickHandlerRef.current) {
      map.off("click", clickHandlerRef.current);
      clickHandlerRef.current = null;
    }
  }, [bindMapClickHandler, interactive]);

  useEffect(() => {
    const map = mapRef.current;
    const navigationControl = navigationControlRef.current;
    if (!map || !navigationControl) {
      return;
    }

    if (showNavigationControl && !hasNavigationControlRef.current) {
      map.addControl(navigationControl, "top-right");
      hasNavigationControlRef.current = true;
    }

    if (!showNavigationControl && hasNavigationControlRef.current) {
      map.removeControl(navigationControl);
      hasNavigationControlRef.current = false;
    }
  }, [showNavigationControl]);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const latNum = Number(lat);
      const lonNum = Number(lon);

      if (
        !Number.isNaN(latNum) &&
        !Number.isNaN(lonNum) &&
        (latNum !== 0 || lonNum !== 0)
      ) {
        const newPos: [number, number] = [lonNum, latNum];
        markerRef.current.setLngLat(newPos);

        mapRef.current.easeTo({
          center: newPos,
          zoom: DEFAULT_MAP_ZOOM,
          duration: 500,
        });
      }
    }
  }, [lat, lon]);

  return (
    <View
      className={clsx(styles.MapWrapper, className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <View
        className={clsx(styles.Map, mapClassName)}
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          ...mapStyle,
        }}
      />
    </View>
  );
}
