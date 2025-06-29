"use client";

import { useGetPropertiesQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export default function Map() {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties || properties.length === 0) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      // style: "mapbox://styles/smitbhamwala/cmchgsggd007q01sb2o849cga",  // Minimo
      style: "mapbox://styles/smitbhamwala/cmchjev6o002601qvde4v5hza", // Streets
      center: [
        filters.coordinates?.[0] || 72.57,
        filters.coordinates?.[1] || 23.02
      ],
      zoom: 10
    });

    properties.forEach((property: Property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");

      if (path) {
        path.setAttribute("fill", "#000000");
      }
    });

    function resizeMap() {
      setTimeout(() => map.resize(), 500);
    }
    resizeMap();

    return () => map.remove();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load map.</p>
      </div>
    );
  }

  if (!properties) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Failed to fetch properties.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              Rs.${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};
