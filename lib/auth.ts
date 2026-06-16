import api, { tokenStore, userStore } from './api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  userName: string;
  phone?: string;
  role?: 'user' | 'club_owner';
}

export interface CreateOrgPayload {
  name: string;
  type: 'club' | 'camp' | 'school';
  description?: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  images?: string[];
  offersLessons?: boolean;
  offersAccommodation?: boolean;
  offersEquipment?: boolean;
}

export interface CreateRegistrationPayload {
  category: 'open' | 'womens' | 'junior' | 'business_cup';
  organizationId?: string;
}

export interface AuthResponse {
  tokenData: { token: string; expiresIn: string; maxAgeSeconds: number };
  refreshTokenData: { token: string; expiresIn: string; maxAgeSeconds: number };
  data: {
    id: string;
    email: string;
    name: string;
    userName: string;
    role: string;
    avatar?: string;
  };
}

export interface OrgResponse {
  data: { id: string; name: string; type: string };
}

export interface RegistrationResponse {
  data: {
    registrationId: string;
    checkoutUrl: string;
    category: string;
    season: string;
    amountCents: number;
  };
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/signup', { data: payload });
  tokenStore.set(res.tokenData.token);
  userStore.set(res.data);
  return res;
}

export async function createOrganization(
  payload: CreateOrgPayload,
): Promise<OrgResponse> {
  return api.post<OrgResponse>('/organizations', { data: payload });
}

export async function uploadPhoto(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return api.upload<UploadResponse>('/upload', formData);
}

export async function createRegistration(
  payload: CreateRegistrationPayload,
): Promise<RegistrationResponse> {
  return api.post<RegistrationResponse>('/open/registrations', { data: payload });
}
