import { apiRequest, assetUrl } from '@/lib/api';

const TOKEN_KEY = 'jobsinc_token';
const USER_KEY = 'jobsinc_user';

export type CandidateProfile = {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  birthDate?: string | null;
  country?: string | null;
  city?: string | null;
  avatarUrl?: string | null;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  skills?: string | null;
  email?: string;
};

export type CandidateInterviewSlot = { id: string; startAt: string; endAt?: string | null };

export type CandidateCompanyLocation = { label?: string | null; address?: string | null; city?: string | null; country?: string | null; mapsUrl?: string | null };

export type CandidateInterview = {
  id: string;
  note?: string | null;
  status?: string;
  confirmedSlotId?: string | null;
  confirmedAt?: string | null;
  companyLocation?: CandidateCompanyLocation | null;
  slots?: CandidateInterviewSlot[];
};

export type CandidateNotification = {
  id: string;
  type?: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read: boolean;
  createdAt: string;
};

export type CandidateSessionUser = {
  id: string;
  email: string;
  role: string;
  candidate?: CandidateProfile | null;
};

export type CandidateJob = {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  contractType?: string;
  jobType?: string;
  department?: string | null;
  workMode?: string | null;
  experience?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  deadline?: string | null;
  responsibilities?: string | null;
  skills?: string | null;
  publishedAt?: string;
  company?: { id: string; name: string; city?: string | null; country?: string | null };
};

export type CandidateApplication = {
  id: string;
  status: string;
  statusLabel?: string;
  cvUrl?: string | null;
  coverLetter?: string | null;
  coverLetterUrl?: string | null;
  interview?: CandidateInterview | null;
  createdAt: string;
  updatedAt: string;
  job?: { id: string; title: string; location?: string; contractType?: string; company?: { id: string; name: string; address?: string | null; city?: string | null; country?: string | null; mapsUrl?: string | null } };
};

export type AuthResponse = { message?: string; token?: string; user?: CandidateSessionUser };

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const API_ORIGIN = new URL(API_URL).origin;
const endpoint = (path: string) => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const candidateAssetUrl = (value?: string | null) => assetUrl(value) ?? (value && !/^https?:\/\//i.test(value) && value.startsWith('/') ? `${API_ORIGIN}${value}` : value) ?? null;

export const getSessionToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY));

export const setSession = (token: string, user?: CandidateSessionUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSessionUser = (): CandidateSessionUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CandidateSessionUser) : null;
  } catch {
    return null;
  }
};

type MaybeData<T> = T | { data?: T } | { results?: T };

function unwrap<T>(response: MaybeData<T>): T {
  if (response && typeof response === 'object') {
    const boxed = response as { data?: T; results?: T };
    if (boxed.data !== undefined) return boxed.data;
    if (boxed.results !== undefined) return boxed.results;
  }
  return response as T;
}

async function multipartRequest<T>(path: string, fields: Record<string, string>, files: { field: string; file: File }[] = []): Promise<T> {
  const token = getSessionToken();
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => value !== undefined && formData.append(key, value));
  files.forEach(({ field, file }) => formData.append(field, file, file.name));
  const response = await fetch(endpoint(path), {
    method: 'POST',
    body: formData,
    credentials: 'include',
    cache: 'no-store',
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(body?.message || body?.error || `Erreur serveur (${response.status})`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function candidateLogin(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login/candidate', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function candidateRegister(fields: Record<string, string>, avatar?: File | null): Promise<AuthResponse> {
  return multipartRequest<AuthResponse>(process.env.NEXT_PUBLIC_CANDIDATE_REGISTER_ENDPOINT || '/auth/register/candidate', fields, avatar ? [{ field: 'avatar', file: avatar }] : []);
}

export async function verifyCandidateSession(): Promise<CandidateSessionUser> {
  const response = await apiRequest<{ success?: boolean; user: CandidateSessionUser }>(process.env.NEXT_PUBLIC_SESSION_ENDPOINT || '/auth/me');
  return response.user;
}

export async function fetchJobs(): Promise<CandidateJob[]> {
  const response = await apiRequest<CandidateJob[] | { data?: CandidateJob[]; results?: CandidateJob[] }>(process.env.NEXT_PUBLIC_CANDIDATE_JOBS_ENDPOINT || '/jobs');
  return unwrap(response);
}

export async function fetchJob(id: string | number): Promise<CandidateJob> {
  const response = await apiRequest<CandidateJob | { data?: CandidateJob }>(`${process.env.NEXT_PUBLIC_CANDIDATE_JOBS_ENDPOINT || '/jobs'}/${id}`);
  return unwrap(response);
}

export async function fetchMyApplications(): Promise<CandidateApplication[]> {
  const response = await apiRequest<CandidateApplication[] | { data?: CandidateApplication[]; results?: CandidateApplication[] }>(process.env.NEXT_PUBLIC_CANDIDATE_APPLICATIONS_ENDPOINT || '/applications/me');
  return unwrap(response);
}

export async function applyToJob(jobId: string | number, payload: { cvUrl: string; coverLetter?: string | null; coverLetterUrl?: string | null }): Promise<CandidateApplication> {
  return apiRequest<CandidateApplication>(`${process.env.NEXT_PUBLIC_CANDIDATE_APPLICATION_ENDPOINT || '/applications/jobs'}/${jobId}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchProfile(): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>(process.env.NEXT_PUBLIC_CANDIDATE_PROFILE_ENDPOINT || '/candidate/profile');
}

export async function saveProfile(payload: Partial<CandidateProfile>): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>(process.env.NEXT_PUBLIC_CANDIDATE_PROFILE_ENDPOINT || '/candidate/profile', { method: 'PUT', body: JSON.stringify(payload) });
}

export async function uploadCv(file: File): Promise<{ message?: string; cvUrl?: string }> {
  return multipartRequest<{ message?: string; cvUrl?: string }>('/candidate/cv', {}, [{ field: 'cv', file }]);
}

export async function uploadCoverLetter(file: File): Promise<{ message?: string; coverLetterUrl?: string }> {
  return multipartRequest<{ message?: string; coverLetterUrl?: string }>('/candidate/cover-letter', {}, [{ field: 'coverLetter', file }]);
}

export async function getNotifications(): Promise<{ data: CandidateNotification[]; unreadCount: number }> {
  const response = await apiRequest<{ data?: CandidateNotification[]; unreadCount?: number }>('/notifications');
  return { data: response?.data ?? [], unreadCount: Number(response?.unreadCount || 0) };
}

export async function markNotificationRead(id: string): Promise<{ success?: boolean }> {
  return apiRequest<{ success?: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<{ success?: boolean }> {
  return apiRequest<{ success?: boolean }>('/notifications/read-all', { method: 'PATCH' });
}

export async function confirmInterviewSlot(applicationId: string, slotId: string): Promise<{ message?: string; interview?: CandidateInterview; statusLabel?: string }> {
  return apiRequest<{ message?: string; interview?: CandidateInterview; statusLabel?: string }>(`/applications/${applicationId}/interview/confirm`, { method: 'POST', body: JSON.stringify({ slotId }) });
}

export async function uploadAvatar(file: File): Promise<{ message?: string; avatarUrl?: string }> {
  return multipartRequest<{ message?: string; avatarUrl?: string }>('/candidate/avatar', {}, [{ field: 'avatar', file }]);
}