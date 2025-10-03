export type GeolocationState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  coords?: { lat: number; lon: number };
  error?: string;
};