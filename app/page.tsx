"use client";

import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Place } from "@/types/places";
import { GeolocationState } from "@/types/GeolocationState";

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationState>({
    status: "idle",
  });

  // Busca a geoLocalização quando a pagina é carregada
  useEffect(() => {
    setLocation({ status: "loading" });
    if (!navigator.geolocation) {
      setLocation({
        status: "error",
        error: "Geolocalização não é suportada pelo seu navegador.",
      });
      return;
    }

    // Guarda a coordenada
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          status: "success",
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (error) => {
        // O usuário pode ter negado a permissão.
        console.error("Erro de Geolocalização:", error);
        setLocation({
          status: "error",
          error:
            "Permissão de localização negada. Buscando em Sorocaba como padrão.",
        });
      }
    );
  }, []);

  // Busca lugares APENAS QUANDO a localização for obtida (ou falhar).
  useEffect(() => {
    if (location.status === "idle" || location.status === "loading") {
      return;
    }

    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);

      // Constroi a URL da nossa API dinamicamente
      let apiUrl = "/api/places";
      if (location.status === "success" && location.coords) {
        apiUrl = `/api/places?lat=${location.coords.lat}&lon=${location.coords.lon}`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("A resposta da rede não foi OK");
        const results = await response.json();
        setPlaces(results);
      } catch (err) {
        console.error("Erro ao carregar os lugares na página:", err);
        setError(
          "Não foi possível carregar os locais. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaces();
  }, [location.status, location.coords]);

  const renderContent = () => {
    if (location.status === 'loading') {
        return <div className="col-span-full text-center text-gray-400"><p>Obtendo sua localização...</p></div>;
    }

    if (isLoading) {
      return Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (error) {
        return <div className="col-span-full text-center text-red-400"><p>{error}</p></div>;
    }

    if (location.status === 'error' && places.length > 0) {
        return (
            <>
                <div className="col-span-full text-center text-yellow-400 mb-4 bg-yellow-900/30 p-2 rounded-md">
                    <p>{location.error}</p>
                </div>
                {places.map((place) => <PlaceCard key={place.id} place={place} />)}
            </>
        )
    }

    if (places.length === 0) {
      return <div className="col-span-full text-center text-gray-400"><p>Nenhum resultado encontrado perto de você.</p></div>;
    }

    return places.map((place) => <PlaceCard key={place.id} place={place} />);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-wider">
          Places API - Teste
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
