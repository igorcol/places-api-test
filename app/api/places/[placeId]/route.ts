/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ placeId: string }> } 
) {
    const { placeId } = await params;

    if (!placeId) {
        return NextResponse.json({ error: 'Place ID é obrigatório' }, { status: 400 });
    }
    if (!API_KEY) {
        return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
    }

    try {
        const fieldsToRequest = 'id,displayName,formattedAddress,rating,photos,websiteUri,nationalPhoneNumber,regularOpeningHours,reviews';
        
        const PLACES_API_URL = `https://places.googleapis.com/v1/places/${placeId}?fields=${fieldsToRequest}&key=${API_KEY}`;

        const response = await fetch(PLACES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Google API Error:", errorBody);
            throw new Error('Falha ao buscar detalhes do lugar no Google');
        }

        const placeDetails = await response.json();

        if (placeDetails.photos) {
            placeDetails.photos.forEach((photo: any) => {
                photo.photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?key=${API_KEY}&maxWidthPx=1024`;
            });
        }

        return NextResponse.json(placeDetails);

    } catch (error) {
        console.error(`Erro na API de detalhes para o placeId: ${placeId}`, error);
        return NextResponse.json({ error: 'Falha ao buscar detalhes do lugar.' }, { status: 500 });
    }
}