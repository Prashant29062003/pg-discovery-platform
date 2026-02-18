import Link from "next/link";
import { PGImageThumbnail } from "@/components/common/PGImageGallery";
import { 
  MapPin, 
  Wifi, 
  Car, 
  Dumbbell, 
  Utensils, 
  Tv,
  Wind,
  Shield,
  Droplets,
  Power,
  Bed,
  Users,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

type EnhancedPGCardProps = {
  slug: string;
  name: string;
  locality: string;
  city: string;
  state?: string;
  isFeatured?: boolean;
  images?: string[] | null;
  thumbnailImage?: string | null;
  amenities?: string[];
  startingPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  gender?: string;
  phoneNumber?: string;
};

const AMENITY_ICONS: Record<string, any> = {
  "WiFi": Wifi,
  "Parking": Car,
  "Gym": Dumbbell,
  "Food": Utensils,
  "TV": Tv,
  "AC": Wind,
  "Security": Shield,
  "Water": Droplets,
  "Power Backup": Power,
};

export default function EnhancedPGCard({
  slug,
  name,
  locality,
  city,
  state,
  isFeatured,
  images,
  thumbnailImage,
  amenities = [],
  startingPrice,
  totalBeds,
  availableBeds,
  rating,
  reviews,
  description,
  gender,
  phoneNumber,
}: EnhancedPGCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  
  // Force image refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageRefreshKey(prev => prev + 1);
    }, 15000); // Refresh images every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Get the thumbnail image - prefer thumbnailImage, then first image, then use fallback
  const displayImage = thumbnailImage || (images && images.length > 0 ? images[0] : null);
  
  // Get top 3 amenities with icons
  const topAmenities = amenities
    .filter(amenity => AMENITY_ICONS[amenity])
    .slice(0, 3);

  const occupancyRate = totalBeds ? Math.round(((totalBeds - (availableBeds || 0)) / totalBeds) * 100) : 0;
  
  const getOccupancyColor = (rate: number) => {
    if (rate < 50) return "text-green-600 bg-green-50 dark:bg-green-950/20";
    if (rate < 80) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20";
    return "text-red-600 bg-red-50 dark:bg-red-950/20";
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Link href={`/pgs/property/${slug}`}>
          <PGImageThumbnail
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            cacheKey={imageRefreshKey} // Pass refresh key to force image updates
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              ⭐ Featured
            </Badge>
          )}
          {gender && (
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm border-0">
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white border-0 rounded-full p-2 h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-zinc-600"}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm hover:bg-white border-0 rounded-full p-2 h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              navigator.share?.({ title: name, url: window.location.href });
            }}
          >
            <Share2 className="w-4 h-4 text-zinc-600" />
          </Button>
        </div>

        {/* Multiple Images Indicator */}
        {images && images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
            {images.length} photos
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 space-y-4">
        {/* Title and Location */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/pgs/property/${slug}`}>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors mb-1">
                  {name}
                </h3>
              </Link>
              <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span>{locality}, {city}</span>
                {state && <span className="text-zinc-400">• {state}</span>}
              </div>
            </div>
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
                {reviews && <span className="text-zinc-400">({reviews})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2">
          {/* Bed Availability */}
          {totalBeds !== undefined && availableBeds !== undefined && (
            <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${getOccupancyColor(occupancyRate)}`}>
              <Bed className="w-3 h-3" />
              {availableBeds}/{totalBeds} beds
              <span className="text-xs opacity-75">({occupancyRate}% occupied)</span>
            </div>
          )}
          
          {/* Amenities */}
          {topAmenities.map((amenity, idx) => {
            const Icon = AMENITY_ICONS[amenity];
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg"
              >
                <Icon className="w-3 h-3" />
                {amenity}
              </div>
            );
          })}
          
          {/* More amenities indicator */}
          {amenities.length > topAmenities.length && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              +{amenities.length - topAmenities.length} more
            </span>
          )}
        </div>

        {/* Price */}
        {startingPrice && (
          <div className="flex items-baseline justify-between pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Starting from</span>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-500">
                ₹{startingPrice.toLocaleString()}
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">/month</span>
              </div>
            </div>
            
            {/* Contact Buttons */}
            <div className="flex gap-2">
              {phoneNumber && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => window.open(`tel:${phoneNumber}`)}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              )}
              <Link href={`/pgs/property/${slug}`}>
                <Button size="sm" className="rounded-full text-xs bg-orange-600 hover:bg-orange-700">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
