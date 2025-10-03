/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar, FaGlobe, FaPhone, FaClock, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { Place } from '@/types/places';

// Componente Skeleton para uma experiência de carregamento mais suave
function DetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            <div className="w-full h-96 bg-gray-700 rounded-lg mb-8"></div>
            <div className="h-10 w-3/4 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-700 rounded mb-8"></div>
            <div className="bg-gray-800 rounded-lg p-6 space-y-4 mb-8">
                <div className="h-5 w-full bg-gray-700 rounded"></div>
                <div className="h-5 w-2/3 bg-gray-700 rounded"></div>
                <div className="h-5 w-1/2 bg-gray-700 rounded"></div>
            </div>
        </div>
    )
}


export default function PlaceDetailPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = use(params);

  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;

    const fetchPlaceDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/places/${placeId}`);
        if (!response.ok) throw new Error('Falha ao buscar detalhes');
        const data = await response.json();
        setPlace(data);
      } catch {
        setError("Não foi possível carregar os detalhes deste lugar.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (isLoading) {
    return <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8"><DetailSkeleton /></main>;
  }

  if (error || !place) {
    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
            <p className="text-red-400 text-lg mb-8">{error}</p>
            <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
                <FaArrowLeft />
                Voltar para a lista
            </Link>
        </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <FaArrowLeft />
            Voltar para a lista
        </Link>
        
        {place.photos && place.photos.length > 0 && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
                <Image
                    src={place.photos[0].photoUrl || ''}
                    alt={`Foto de ${place.displayName.text}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {place.displayName.text}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-lg text-gray-300">
            {place.rating && (
                <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span>{place.rating.toFixed(1)}</span>
                </div>
            )}
             <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-cyan-400" />
                <span>{place.formattedAddress}</span>
            </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-6 mb-8 border border-gray-700">
            {place.regularOpeningHours && (
                 <div className="flex items-start gap-4">
                    <FaClock className="text-cyan-400 mt-1 flex-shrink-0 text-xl" />
                    <div>
                        <h3 className={`font-semibold mb-1 ${place.regularOpeningHours.openNow ? 'text-green-400' : 'text-red-400'}`}>
                            {place.regularOpeningHours.openNow ? "Aberto agora" : "Fechado agora"}
                        </h3>
                        <ul className="text-sm text-gray-400 space-y-1">
                            {place.regularOpeningHours.weekdayDescriptions?.map(desc => <li key={desc}>{desc}</li>)}
                        </ul>
                    </div>
                </div>
            )}
            {place.nationalPhoneNumber && (
                <div className="flex items-center gap-4">
                    <FaPhone className="text-cyan-400 text-xl" />
                    <a href={`tel:${place.nationalPhoneNumber}`} className="hover:underline">{place.nationalPhoneNumber}</a>
                </div>
            )}
            {place.websiteUri && (
                 <div className="flex items-center gap-4">
                    <FaGlobe className="text-cyan-400 text-xl" />
                    <a href={place.websiteUri} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{place.websiteUri}</a>
                </div>
            )}
        </div>

        {place.reviews && place.reviews.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold mb-6">O que as pessoas dizem ({place.reviews.length})</h2>
                <div className="space-y-6">
                    {place.reviews.slice(0, 5).map((review: any, index: any) => ( // Mostra até 5 reviews
                        <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-2">
                                <span className="font-semibold text-white">{review.authorAttribution.displayName}</span>
                                <span className="text-gray-500 mx-2">•</span>
                                <span className="text-sm text-gray-400">{review.relativePublishTimeDescription}</span>
                            </div>
                            <div className="flex items-center mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'} />
                                ))}
                            </div>
                            <p className="text-gray-300 leading-relaxed">{review.text?.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </main>
  );
}