"use client";

import { useEffect, useState } from 'react';
import PlaceCard from '@/components/PlaceCard';
import { searchPlaces } from '@/lib/google-places';
import SkeletonCard from '@/components/SkeletonCard';
import { Place } from '@/types/places';

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const results = await searchPlaces();
        setPlaces(results);
      } catch (error) {
        console.error("Erro ao carregar os lugares na página:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      // Array de 9 posições para renderizar 9 skeletons
      return Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (places.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-400">
          <p>Nenhum resultado encontrado. Tente novamente mais tarde.</p>
        </div>
      );
    }

    return places.map((place) => <PlaceCard key={place.id} place={place} />);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-wider">
          Mapa da Noite - Sorocaba
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}