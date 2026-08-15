export type Company = {
  id: string | number;
  name: string;
  sector?: string;
  location?: string;
  logo?: string | null;
};

export type Job = {
  id: string | number;
  title: string;
  company?: string;
  location?: string;
  contractType?: string;
  publishedAt?: string;
};

export type DashboardData = {
  user?: { name?: string; firstName?: string; lastName?: string; role?: string; avatar?: string | null };
  company?: { name?: string; sector?: string; size?: string; country?: string; city?: string; address?: string; website?: string; foundedYear?: string | number; description?: string; photos?: string[]; image?: string | null };
  stats?: Record<string, number | string | null>;
  actions?: Array<{ id?: string | number; type?: string; label?: string; count?: number; href?: string }>;
  activity?: Array<{ label?: string; value?: number; date?: string }>;
  applications?: Array<{ id?: string | number; candidateName?: string; name?: string; jobTitle?: string; title?: string; date?: string; status?: string; avatar?: string | null }>;
  jobs?: Array<{ id?: string | number; title?: string; location?: string; contractType?: string; applicationsCount?: number; status?: string; publishedAt?: string }>;
  notifications?: Array<{ id?: string | number; label?: string; read?: boolean }>;
  matching?: Array<{ id?: string | number; candidateName?: string; name?: string; jobTitle?: string; title?: string; score?: number; matchScore?: number; location?: string; avatar?: string | null; skills?: string[] }>;
};

export type CompanyMessage = {
  id?: string | number;
  conversationId?: string | number;
  participantName?: string;
  senderName?: string;
  name?: string;
  subject?: string;
  preview?: string;
  content?: string;
  date?: string;
  createdAt?: string;
  unread?: boolean;
  read?: boolean;
  avatar?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

function endpoint(path: string) {
  if (!API_URL) return null;
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Fonction générique pour effectuer des requêtes HTTP JSON avec envoi du Token JWT
 */
export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = endpoint(path);
  if (!url) throw new Error('API non configurée');

  // Récupération automatique du token dans localStorage (côté client)
  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('jobsinc_token') || localStorage.getItem('token'))
    : null;

  // Construction des en-têtes HTTP
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(
      body?.error || body?.message || `Erreur serveur (${response.status})`
    ) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Fonction pour envoyer des formulaires multipart/form-data (fichiers, images, etc.)
 */
async function apiRequestForm<T>(path: string, body: FormData): Promise<T> {
  const url = endpoint(path);
  if (!url) throw new Error('API non configurée');

  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('jobsinc_token') || localStorage.getItem('token'))
    : null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { 
    method: 'POST', 
    body, 
    headers,
    credentials: 'include' 
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null);
    throw new Error(responseBody?.error || responseBody?.message || `Erreur serveur (${response.status})`);
  }

  return response.json();
}

// ==========================================
// API AUTHENTIFICATION & SESSION
// ==========================================

export async function authenticate(path: string, payload: Record<string, unknown>) {
  return apiRequest<{ token?: string; user?: any; role?: string }>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function authenticateWithFiles(path: string, fields: Record<string, string>, files: File[], fieldName = 'photos') {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  files.forEach((file) => formData.append(fieldName, file, file.name));
  return apiRequestForm<{ token?: string; user?: any; role?: string }>(path, formData);
}

export function isApiConfigured() {
  return Boolean(API_URL);
}

// ==========================================
// API TABLEAU DE BORD & RECRUTEMENT
// ==========================================

export async function getDashboardData() {
  const dashboardEndpoint = process.env.NEXT_PUBLIC_DASHBOARD_ENDPOINT || '/auth/me';
  return apiRequest<DashboardData>(dashboardEndpoint);
}

export async function getMatching() {
  const matchingEndpoint = process.env.NEXT_PUBLIC_MATCHING_ENDPOINT || '/matching';
  const response = await apiRequest<{ data?: DashboardData['matching']; results?: DashboardData['matching'] } | DashboardData['matching']>(matchingEndpoint);
  if (Array.isArray(response)) return response;
  return response?.data || response?.results || [];
}

export async function getCompanyJobs() {
  const jobsEndpoint = process.env.NEXT_PUBLIC_COMPANY_JOBS_ENDPOINT || '/jobs';
  const response = await apiRequest<Job[] | { data?: Job[]; results?: Job[] }>(jobsEndpoint);
  return Array.isArray(response) ? response : response.data || response.results || [];
}

export async function getCompanyApplications() {
  const applicationsEndpoint = process.env.NEXT_PUBLIC_COMPANY_APPLICATIONS_ENDPOINT || '/applications';
  const response = await apiRequest<DashboardData['applications'] | { data?: DashboardData['applications']; results?: DashboardData['applications'] }>(applicationsEndpoint);
  return Array.isArray(response) ? response : response?.data || response?.results || [];
}

export async function getCompanyMessages() {
  const messagesEndpoint = process.env.NEXT_PUBLIC_COMPANY_MESSAGES_ENDPOINT || '/messages';
  const response = await apiRequest<CompanyMessage[] | { data?: CompanyMessage[]; results?: CompanyMessage[] }>(messagesEndpoint);
  return Array.isArray(response) ? response : response?.data || response?.results || [];
}

export async function getCompanies() {
  const response = await apiRequest<Company[] | { data?: Company[]; results?: Company[] }>(process.env.NEXT_PUBLIC_COMPANIES_ENDPOINT || '/companies');
  return Array.isArray(response) ? response : response.data || response.results || [];
}

export async function getJobs() {
  const response = await apiRequest<Job[] | { data?: Job[]; results?: Job[] }>(process.env.NEXT_PUBLIC_JOBS_ENDPOINT || '/jobs');
  return Array.isArray(response) ? response : response.data || response.results || [];
}

export async function getStats(): Promise<Record<string, number>> {
  const response = await apiRequest<Record<string, number> | { data?: Record<string, number> }>(process.env.NEXT_PUBLIC_STATS_ENDPOINT || '/stats');
  if (typeof response === 'object' && response !== null && 'data' in response && typeof response.data === 'object' && response.data !== null) {
    return response.data as Record<string, number>;
  }
  return response as Record<string, number>;
}