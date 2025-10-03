"use client";

import { useEffect, useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Place } from "@/types/places";
import { GeolocationState } from "@/types/GeolocationState";
import {
  FaSearch,
  FaCocktail,
  FaMusic,
} from "react-icons/fa";
import { GiCigar } from "react-icons/gi";

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
    if (location.status === "loading") {
      return (
        <div className="col-span-full text-center text-gray-400">
          <p>Obtendo sua localização...</p>
        </div>
      );
    }

    if (isLoading) {
      return Array.from({ length: 9 }).map((_, index) => (
        <SkeletonCard key={index} />
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center text-red-400">
          <p>{error}</p>
        </div>
      );
    }

    if (location.status === "error" && places.length > 0) {
      return (
        <>
          <div className="col-span-full text-center text-yellow-400 mb-4 bg-yellow-900/30 p-2 rounded-md">
            <p>{location.error}</p>
          </div>
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </>
      );
    }

    if (places.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-400">
          <p>Nenhum resultado encontrado perto de você.</p>
        </div>
      );
    }

    return places.map((place) => <PlaceCard key={place.id} place={place} />);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* CABEÇALHO E CONTROLES */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Places API - Teste
          </h1>

          {/* --- PAINEL DE CONTROLE (BUSCA E FILTROS) --- */}
          <div className="space-y-6">
            {/* Barra de Busca */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Procurar por um lugar específico..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
              />
            </div>

            {/* Filtros e Toggle */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Botões de Filtro */}
              <div className="flex items-center gap-2 flex-wrap">
                <button className="px-4 py-2 text-sm font-semibold bg-cyan-500 text-white rounded-full transition hover:opacity-90">
                  Todos
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-full transition hover:bg-gray-700 flex items-center gap-2">
                  <FaCocktail /> Lounges
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-full transition hover:bg-gray-700 flex items-center gap-2">
                  <GiCigar /> Hookah
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-full transition hover:bg-gray-700 flex items-center gap-2">
                  <FaMusic /> Festas
                </button>
              </div>

              {/* Toggle "Abertos Agora" */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">
                  Abertos Agora
                </span>
                <button
                  role="switch"
                  aria-checked="true"
                  className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-cyan-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- GRID DE RESULTADOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
