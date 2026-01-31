import Link from "next/link";
import { PGImageThumbnail } from "@/components/common/PGImageGallery";
import { MapPin, Wifi, DoorOpen, Bed } from "lucide-react";

type PGCardProps = {
  slug: string;
  name: string;
  locality: string;
  city: string;
  isFeatured?: boolean;
  images?: string[] | null;
  thumbnailImage?: string | null;
  amenities?: string[];
  startingPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
};

export default function PGCard({
  slug,
  name,
  locality,
  city,
  isFeatured,
  images,
  thumbnailImage,
  amenities = [],
  startingPrice,
  totalBeds,
  availableBeds,
}: PGCardProps) {
  // Get the thumbnail image - prefer thumbnailImage, then first image, then use fallback
  const displayImage = thumbnailImage || (images && images.length > 0 ? images[0] : null);

  return (
    <Link
      href={`/pgs/property/${slug}`}
      className="group block rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-900"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <PGImageThumbnail
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Multiple Images Indicator */}
        {images && images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
            {images.length} photos
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-3">
        {/* Title and Location */}
        <div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            <MapPin className="w-4 h-4" />
            {locality}, {city}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Bed Availability */}
          {totalBeds !== undefined && availableBeds !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
              <Bed className="w-3 h-3" />
              {availableBeds}/{totalBeds} beds
            </span>
          )}
          
          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            amenities.slice(0, totalBeds !== undefined ? 1 : 2).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg"
              >
                {amenity === "WiFi" || amenity.includes("WiFi") ? (
                  <>
                    <Wifi className="w-3 h-3" /> {amenity}
                  </>
                ) : amenity.includes("Room") ? (
                  <>
                    <DoorOpen className="w-3 h-3" /> {amenity}
                  </>
                ) : (
                  amenity
                )}
              </span>
            ))
          )}
          
          {/* More amenities indicator */}
          {amenities && amenities.length > (totalBeds !== undefined ? 1 : 2) && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              +{amenities.length - (totalBeds !== undefined ? 1 : 2)} more
            </span>
          )}
        </div>

        {/* Price */}
        {startingPrice && (
          <div className="flex items-baseline justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Starting from</span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-500">
              ₹{startingPrice.toLocaleString()}
              <span className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">/month</span>
            </span>
          </div>
        )}

        {/* View Details CTA */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-500 group-hover:gap-2 transition-all">
            View Details
            <span className="text-lg">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
