/* eslint-disable @typescript-eslint/no-unused-vars */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

// !!!! >> NÃO USAR << !!!! \\
// !!!! >> NÃO USAR << !!!! \\
// !!!! >> NÃO USAR << !!!! \\
// ! FUNÇÃO ANTIGA PARA A V1 
// Para a V2 utilizamos a rota app/api/places/route.ts
/**
 * Busca lugares de um tipo específico em sorocaba
 */
async function searchPlaces() {
    if (!API_KEY) {
        throw new Error("A chave da API do google places não foi configurada.");
    }
    console.log("Chave da API encontrada. Pronto para buscar os lugares.");

    const sorocabaLocation = {
        latitude: -23.5019,
        longitude: -47.4580,
    };

    // ---- LÓGICA DE BUSCA ----

    try {
        const response = await fetch(PLACES_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                // Máscara de campos: pede só os dados que vamos usar
                // Economiza dinheiro e deixa a resposta mais rápida
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.photos',
            },
            body: JSON.stringify({
                // Oq procuramos
                textQuery: 'bares e baladas em Sorocaba',
                // Quantos resultados queremos (máx 20 por pag)
                maxResultCount: 10,
                locationBias: {
                    circle: {
                        center: sorocabaLocation,
                        radius: 10000.0 // raio de 10 km
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na chamada da API: ${response.statusText}`)
        }

        const data = await response.json();

        return data.places || [];
    }
    catch (error) {
        console.error("Falha ao buscar lugares:", error);
        return [];
    }
}