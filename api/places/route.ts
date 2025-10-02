import { Place } from "@/types/places";
import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

const sorocabaLocation = {
    latitude: -23.5019,
    longitude: -47.4580,
};

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

// * GET PRINCIPAL DA API
export async function GET() {
    try {
        // Dispara as buscas em paralelo para maximizar performance
        const [nightclubs, bars, events] = await Promise.all([ // ? Aqui trocaremos pelos filtros vindos do front ??
            searchText('baladas em Sorocaba'),
            searchText('bares em Sorocaba'),
            searchText('shows efestas em Sorocaba hoje')
        ]);

        // Map para juntar os resultados e remover duplicatas
        const allPlaces = new Map<string, Place>();
        [...bars, ...nightclubs, ...events].forEach(place => {
            if (place && place.id) {
                allPlaces.set(place.id, place);
            }
        });

        const uniquePlaces = Array.from(allPlaces.values());

        return NextResponse.json(uniquePlaces);
    }
    catch (error) {
        console.error("Erro geral no endpoint /api/places:", error);
        return NextResponse.json({ error: 'Falha ao buscar os locais.' }, { status: 500 });
    }
}