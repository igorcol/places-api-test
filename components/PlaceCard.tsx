
import { Place } from '@/types/places';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';


export default function PlaceCard({ place }: { place: Place }) {

  const photoUrl = place.photoUrl;

  return (
    <div className="cursor-pointer bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/50">
      <div className="relative w-full h-40">
        {photoUrl ? ( 
          <Image
            src={photoUrl} 
            alt={`Foto de ${place.displayName.text}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
            <span>Sem Foto</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 truncate">{place.displayName.text}</h3>
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