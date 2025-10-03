import { Place } from "@/types/places";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

const sorocabaLocation = {
    latitude: -23.5019,
    longitude: -47.4580,
};

// --- LÓGICA DE CACHE V3 ---
const cache = new Map<string, { timestamp: number; data: Place[] }>();
const CACHE_DURATION_MS = 30 * 60 * 1000;


// * BUSCA POR TEXTO
// ! NÃO UTILIZADA NO V3 ( Utiliza searchNearby )
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// * NEARBY SEARCH
async function searchNearby(coords: { lat: number; lon: number }, includedTypes: string[]): Promise<Place[]> {
    if (!API_KEY) throw new Error("API Key not configured.");

    const response = await fetch(PLACES_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos',
        },
        body: JSON.stringify({
            includedTypes, // Ex: ['bar', 'night_club']
            maxResultCount: 10,
            locationRestriction: {
                circle: {
                    center: sorocabaLocation,
                    radius: 5000.0, // Raio de 5km
                },
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro na chamada da API para tipos "${includedTypes.join(', ')}": ${response.statusText}`, errorBody);
        return [];
    }

    const data = await response.json();
    return data.places || [];
}

// * -------- GET PRINCIPAL DA API --------
export async function GET(request: NextRequest) {
    // Le as coordenadas da URL que o front envia
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '-23.5019');
    const lon = parseFloat(searchParams.get('lon') || '-47.4580');

    // Cria chave de cache arredondando as coord
    // Agrupa usuários na mesma "célula" de ~1.1km
    const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
        console.log(`CACHE HIT! Servindo dados para a região ${cacheKey}.`);
        return NextResponse.json(cachedEntry.data);
    }
    console.log(`CACHE MISS! Buscando novos dados para a região ${cacheKey}.`);

    try {
        const [corePlaces, extendedPlaces] = await Promise.all([
            searchNearby({ lat, lon }, ['night_club', 'bar']), // Tipos primários
            searchNearby({ lat, lon }, ['restaurant', 'cafe']), // Tipos secundarios
        ]);

        const allPlaces = new Map<string, Place>();
        [...corePlaces, ...extendedPlaces].forEach(place => {
            if (place && place.id) allPlaces.set(place.id, place);
        });

        const uniquePlaces = Array.from(allPlaces.values()).map(place => {
            const photoName = place.photos?.[0]?.name;
            const photoUrl = photoName
                ? `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=400`
                : null;
            return { ...place, photoUrl };
        });

        // Salva os novos dados na pasta correta do cache
        cache.set(cacheKey, { timestamp: Date.now(), data: uniquePlaces });

        return NextResponse.json(uniquePlaces);
    }
    catch (error) {
        console.error(`Erro geral no endpoint para a região ${cacheKey}:`, error);
        return NextResponse.json({ error: 'Falha ao buscar os locais.' }, { status: 500 });
    }

}