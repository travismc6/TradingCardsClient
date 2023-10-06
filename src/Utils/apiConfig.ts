// apiConfig.ts
const API_BASE_URL = "https://localhost:44395/api";

export const ENDPOINTS = {
  GET_CARDS: `${API_BASE_URL}/cards`,
  SAVE_COLLECTION: `${API_BASE_URL}/cards`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  SAVE_CARD: `${API_BASE_URL}/cards/collectionCard`,
  IMAGE_UPLOAD: (id: string) => `${API_BASE_URL}/cards/image/${id}`,
  CARD_DETAILS: (id: string) => `${API_BASE_URL}/cards/${id}`,
};
