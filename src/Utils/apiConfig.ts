// apiConfig.ts
const API_BASE_URL = "https://localhost:44395/api";

export const ENDPOINTS = {
  GET_CHECKLIST: `${API_BASE_URL}/cardchecklist`,
  SAVE_CHECKLIST: `${API_BASE_URL}/cardchecklist`,
  EXPORT_CHECKLIST: `${API_BASE_URL}/cardchecklist/export`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  SAVE_CARD: `${API_BASE_URL}/cardcollection`,
  IMAGE_UPLOAD: (id: string) => `${API_BASE_URL}/cardcollection/image/${id}`,
  CARD_DETAILS: (id: string) => `${API_BASE_URL}/cardcollection/${id}`,
};
