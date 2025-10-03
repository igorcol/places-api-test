import { Place } from "@/types/places";
import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

const sorocabaLocation = {
    latitude: -23.5019,
    longitude: -47.4580,
};

// --- LÓGICA DE CACHE ---
let cachedData: Place[] | null = null;
let cacheTimestamp: number | null = null;
// Tempo de vida do cache em ms
const CACHE_DURATION_MS = 30 * 60 * 1000;

// Função auxiliar para fazer uma busca especifica
// TODO: No futuro -> usar "Nearby Search" com tipos
async function searchText(textQuery: string): Promise<Place[]> {
    if (!API_KEY) {
        console.error("A chave da API do Google Places não foi configurada no servidor.");
        throw new Error("API Key not configured.");
    }

    const response = await fetch(PLACES_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos',
        },
        body: JSON.stringify({
            textQuery,
            locationBias: { // Preferencia locais perto do centro de Sorocaba
                circle: {
                    center: sorocabaLocation,
                    radius: 10000.0,
                },
            },
            maxResultCount: 10,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro na chamada da API para query "${textQuery}": ${response.statusText}`, errorBody);
        return [];
    }

    const data = await response.json();
    return data.places || [];
}

// * ---- GET PRINCIPAL DA API ----
export async function GET() {
    // --- VERIFICAÇÃO DO CACHE ---
    // Checa se temos dados e se o tempo não expirou
    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION_MS)) {
        console.log("CACHE HIT! Entregando dados salvos.")
        return NextResponse.json(cachedData);
    }
    // Se o cache está velho ou não existe, continua
    console.log('CACHE MISS! Buscando novos dados do Google')

    try {
        // Dispara as buscas em paralelo para maximizar performance
        const [nightclubs, bars, events] = await Promise.all([ // ? Aqui trocaremos pelos filtros vindos do front ??
            searchText('baladas em Sorocaba'),
            searchText('bares em Sorocaba'),
            searchText('shows e festas em Sorocaba hoje')
        ]);

        // Map para juntar os resultados e remover duplicatas
        const allPlaces = new Map<string, Place>();
        [...bars, ...nightclubs, ...events].forEach(place => {
            if (place && place.id) {
                allPlaces.set(place.id, place);
            }
        });

        const uniquePlaces = Array.from(allPlaces.values()).map(place => {
            const photoName = place.photos?.[0]?.name;
            const photoUrl = photoName
                ? `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=400`
                : null; 
            return { ...place, photoUrl };
        });

        // --- ATUALIZAÇÃO DO CACHE ---
        cachedData = uniquePlaces;
        cacheTimestamp = Date.now();

        return NextResponse.json(uniquePlaces);
    }
    catch (error) {
        console.error("Erro geral no endpoint /api/places:", error);
        return NextResponse.json({ error: 'Falha ao buscar os locais.' }, { status: 500 });
    }
}