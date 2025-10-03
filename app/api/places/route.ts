import { Place } from "@/types/places";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Cache V3: Geograficamente segmentado
const cache = new Map<string, { timestamp: number; data: Place[] }>();
const CACHE_DURATION_MS = 30 * 60 * 1000;


// * Busca por Proximidade
async function searchNearby(coords: { lat: number; lon: number }, includedTypes: string[]): Promise<Place[]> {
    const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';
    if (!API_KEY) throw new Error("API Key not configured.");

    const response = await fetch(PLACES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos' },
        body: JSON.stringify({
            includedTypes,
            maxResultCount: 10,
            locationRestriction: { circle: { center: { latitude: coords.lat, longitude: coords.lon }, radius: 5000.0 } },
        }),
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.places || [];
}

// * Busca por Texto
async function searchText(coords: { lat: number; lon: number }, textQuery: string): Promise<Place[]> {
    const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';
    if (!API_KEY) throw new Error("API Key not configured.");

    const response = await fetch(PLACES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos' },
        body: JSON.stringify({
            textQuery,
            maxResultCount: 10,
            locationBias: { circle: { center: { latitude: coords.lat, longitude: coords.lon }, radius: 5000.0 } },
        }),
    });

    if (!response.ok) return [];
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
        const [
            nearbyPlaces, loungePlaces, hookahPlaces, partyPlaces
        ] = await Promise.all([
            searchNearby({ lat, lon }, ['night_club', 'bar']),
            searchText({ lat, lon }, 'lounge'),
            searchText({ lat, lon }, 'deck'),
            searchText({ lat, lon }, 'hookah OR tabacaria'),
            searchText({ lat, lon }, 'festas'),
        ]);

        // Junta tudo e remove duplicados
        const allPlaces = new Map<string, Place>();
        [...nearbyPlaces, ...loungePlaces, ...hookahPlaces, ...partyPlaces].forEach(place => {
            if (place && place.id) allPlaces.set(place.id, place);
        });

        const uniquePlaces = Array.from(allPlaces.values()).map(place => {
            const photoName = place.photos?.[0]?.name;
            const photoUrl = photoName
                ? `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=400`
                : null;
            return { ...place, photoUrl };
        });

        cache.set(cacheKey, { timestamp: Date.now(), data: uniquePlaces });

        return NextResponse.json(uniquePlaces);
    }
    catch (error) {
        console.error(`Erro geral no endpoint para a região ${cacheKey}:`, error);
        return NextResponse.json({ error: 'Falha ao buscar os locais.' }, { status: 500 });
    }
}