import { createClient } from '@base44/sdk';

// Read credentials from Vite env vars to keep secrets out of source.
const APP_ID = (import.meta.env && import.meta.env.VITE_BASE44_APP_ID) || '6a8a98432ec51b3deb4874f3';
const API_KEY = (import.meta.env && import.meta.env.VITE_BASE44_API_KEY) || '';

const headers = {};
if (API_KEY) headers.api_key = API_KEY;

export const base44 = createClient({
  appId: APP_ID,
  headers,
});
