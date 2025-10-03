
// Estrutura de um único lugar retornado pela API do google
export interface Place {
    id: string
    displayName: {
        text: string
        languageCode: string
    };
    formattedAddress: string
    rating?: number
    photos?: {
        name: string;
        photoUrl?: string;
    }[];
    photoUrl?: string | null;
    types?: string[]; // Tipo do local
    primaryType?: string;

    // -- CAMPOS PARA A PAGINA DE DETALHES --
    websiteUri?: string; // Pagina do local
    nationalPhoneNumber?: string;
    regularOpeningHours?: {
        openNow: boolean;
        weekdayDescriptions: string[];
    };
    reviews?: {
        authorAttribution: {
            displayName: string;
        },
        relativePublishTimeDescription: string;
        rating: number;
        text: {
            text: string;
        }
    }[];
}