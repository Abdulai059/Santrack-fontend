"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LocationSlugs({
  locations = [],
  activeLocation,
  onSelect,
}) {
  const [images, setImages] = useState({});

  useEffect(() => {
    if (!locations.length) return;

    fetchLocationImages();
  }, [locations]);

  async function fetchLocationImages() {
    try {
      const locationIds = locations.map((loc) => loc.id);

      const { data, error } = await supabase
        .from("location_images")
        .select("location_id, image_url, image_type, caption")
        .in("location_id", locationIds);

      if (error) throw error;

      const grouped = groupImagesByLocation(data || []);

      const mappedImages = {};

      locations.forEach((loc) => {
        const imgs = grouped[loc.id] || [];

        if (!imgs.length) {
          mappedImages[loc.id] = null;
          return;
        }

        const primary =
          imgs.find((img) => img.image_type === "primary") || imgs[0];

        mappedImages[loc.id] = {
          url: primary.image_url,
          caption: primary.caption,
          count: imgs.length,
        };
      });

      setImages(mappedImages);
    } catch (err) {
      console.error("Image fetch error:", err.message);
    }
  }

  function groupImagesByLocation(data) {
    return data.reduce((acc, img) => {
      if (!acc[img.location_id]) {
        acc[img.location_id] = [];
      }

      acc[img.location_id].push(img);

      return acc;
    }, {});
  }

  if (!locations.length) {
    return (
      <aside className="w-64 border-r border-gray-200 bg-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-sm">No locations found</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-800">
            Locations
          </h2>

          <span className="text-xs text-gray-400">{locations.length}</span>
        </div>
      </div>

      {/* List */}
      <div className="p-3 space-y-3">
        {locations.map((loc) => {
          const image = images[loc.id];
          const isActive = activeLocation?.id === loc.id;

          return (
            <LocationCard
              key={loc.id}
              location={loc}
              image={image}
              isActive={isActive}
              onClick={() => onSelect(loc)}
            />
          );
        })}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                                LOCATION CARD                               */
/* -------------------------------------------------------------------------- */

function LocationCard({ location, image, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full overflow-hidden rounded-lg border text-left transition-all
        ${
          isActive
            ? "border-slate-300 shadow-md bg-slate-50"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      {/* Image */}
      <div className="relative h-28 bg-gray-100 overflow-hidden">
        {image === undefined && <Skeleton />}

        {image?.url && (
          <img
            src={image.url}
            alt={image.caption || location.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        )}

        {image === null && <LocationPlaceholder location={location} />}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase text-gray-800 line-clamp-2">
            {location.name}
          </h3>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">
          {location.type}

          {location.communityName && <> · {location.communityName}</>}
        </p>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                PLACEHOLDER                                 */
/* -------------------------------------------------------------------------- */

function LocationPlaceholder({ location }) {
  const initials = location.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2"
      style={{
        background: `${location.color}18`,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow"
        style={{
          background: location.color,
        }}
      >
        {initials}
      </div>

      <span
        className="text-[10px] font-medium uppercase tracking-wider"
        style={{
          color: location.color,
        }}
      >
        No Image
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SKELETON                                  */
/* -------------------------------------------------------------------------- */

function Skeleton() {
  return <div className="h-full w-full animate-pulse bg-gray-200" />;
}
