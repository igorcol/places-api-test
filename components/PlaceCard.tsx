import { Place } from "@/types/places";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

interface PlaceCardProps {
  place: Place;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

// Construir a URL da foto a partir do 'name' retornado pela API
const getPhotoUrl = (photoName: string) => {
  return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=400`;
};

export default function PlaceCard({ place }: PlaceCardProps) {
  // Pega a primeira foto disponível
  const photoName = place.photos?.[0]?.name;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/50">
      <div className="relative w-full h-40">
        {photoName ? (
          <Image
            src={getPhotoUrl(photoName)}
            alt={`Foto de ${place.displayName.text}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
            <span>Sem Foto</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate">
          {place.displayName.text}
        </h3>
        <p className="flex items-center text-sm text-gray-400 mb-2">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <span className="truncate">{place.formattedAddress}</span>
        </p>
        {place.rating && (
          <p className="flex items-center text-sm font-semibold text-yellow-400">
            <FaStar className="mr-1" />
            <span>{place.rating.toFixed(1)} / 5</span>
          </p>
        )}
      </div>
    </div>
  );
}
