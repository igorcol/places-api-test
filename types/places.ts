
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
    }[];
    photoUrl?: string | null;
    types?: string[]; // Tipo do local
    primaryType?: string;
    websiteUri?: string; // Pagina do local
}