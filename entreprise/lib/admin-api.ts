import { apiRequest } from '@/lib/api';

export type AdminUser = {
  id?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: string | null;
};

export type AdminStat = number | string | null | undefined;

export type AdminOverviewData = {
  user?: AdminUser;
  stats?: Record<string, AdminStat>;
  attention?: Array<{ id?: string | number; label?: string; description?: string; count?: number; href?: string; priority?: string }>;
  activity?: Array<{ id?: string | number; actor?: string; action?: string; resource?: string; label?: string; date?: string; createdAt?: string }>;
  activitySeries?: Array<{ label?: string; date?: string; value?: number }>;
  system?: Array<{ id?: string | number; label?: string; status?: string; description?: string }>;
  userDistribution?: Array<{ label?: string; key?: string; value?: number; count?: number; color?: string }>;
  securitySummary?: Array<{ label?: string; value?: number | string; status?: string; href?: string }>;
};

export type AdminUserRecord = AdminUser & {
  phone?: string;
  status?: string;
  company?: string;
  companyName?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  registeredAt?: string;
  lastActivity?: string;
  lastLogin?: string;
  userType?: string;
  isBlocked?: boolean;
  skills?: string;
  companyInfo?: {
    id?: string;
    name?: string;
    description?: string | null;
    website?: string | null;
    sector?: string | null;
    size?: string | null;
    country?: string | null;
    city?: string | null;
    address?: string | null;
    mapsUrl?: string | null;
    foundedYear?: number | null;
    isApproved?: boolean;
    createdAt?: string;
    jobsCount?: number;
    applicationsCount?: number;
    employeesCount?: number;
  };
  companyJobs?: Array<{
    id?: string | number;
    title?: string;
    location?: string;
    jobType?: string;
    status?: string;
    applicationsCount?: number;
    createdAt?: string;
  }>;
  employments?: Array<{
    id?: string | number;
    position?: string;
    status?: string;
    startDate?: string;
    company?: { name?: string };
  }>;
  candidateApplications?: Array<{
    id?: string | number;
    jobTitle?: string;
    jobId?: string | number;
    companyName?: string;
    location?: string;
    status?: string;
    createdAt?: string;
    interview?: { confirmedSlot?: { startAt?: string } | null; status?: string };
  }>;
  notifications?: Array<{
    id?: string | number;
    title?: string;
    body?: string | null;
    link?: string | null;
    read?: boolean;
    createdAt?: string;
  }>;
};

export type AdminAuthResponse = {
  token?: string;
  user?: AdminUser;
};

const adminLoginEndpoint = process.env.NEXT_PUBLIC_ADMIN_LOGIN_ENDPOINT || process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || '/auth/login/admin';

export async function adminLogin(payload: Record<string, unknown>) {
  return apiRequest<AdminAuthResponse>(adminLoginEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyAdminSession() {
  const sessionEndpoint = process.env.NEXT_PUBLIC_ADMIN_SESSION_ENDPOINT || '/auth/me';
  return apiRequest<{ user?: AdminUser }>(sessionEndpoint);
}

export async function getAdminOverview() {
  const dashboardEndpoint = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_ENDPOINT || '/admin/overview';
  return apiRequest<AdminOverviewData>(dashboardEndpoint);
}

function getList<T>(response: T[] | { data?: T[]; results?: T[]; users?: T[] } | null) {
  if (Array.isArray(response)) return response;
  return response?.data || response?.results || response?.users || [];
}

export async function getAdminUsers() {
  const endpoint = process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT || '/admin/users';
  const response = await apiRequest<AdminUserRecord[] | { data?: AdminUserRecord[]; results?: AdminUserRecord[]; users?: AdminUserRecord[] }>(endpoint);
  return getList(response);
}

export async function getAdminUser(id: string) {
  const template = process.env.NEXT_PUBLIC_ADMIN_USER_ENDPOINT || '/admin/users/[id]';
  const endpoint = template.includes('[id]') ? template.replace('[id]', encodeURIComponent(id)) : `${template.replace(/\/$/, '')}/${encodeURIComponent(id)}`;
  return apiRequest<AdminUserRecord>(endpoint);
}

export async function getAdminResource(section: string) {
  const key = section.replace(/[^a-zA-Z]/g, '_').toUpperCase();
  const endpoint = process.env[`NEXT_PUBLIC_ADMIN_${key}_ENDPOINT`] || `/admin/${section}`;
  const response = await apiRequest<unknown[] | { data?: unknown[]; results?: unknown[] }>(endpoint);
  if (Array.isArray(response)) return response;
  return response.data || response.results || [];
}

export async function setAdminUserBlocked(id: string, blocked: boolean) {
  const endpoint = process.env.NEXT_PUBLIC_ADMIN_BLOCK_ENDPOINT ? process.env.NEXT_PUBLIC_ADMIN_BLOCK_ENDPOINT.replace('[id]', encodeURIComponent(id)) : `/admin/users/${encodeURIComponent(id)}/block`;
  return apiRequest<{ success?: boolean; blocked?: boolean }>(endpoint, { method: 'POST', body: JSON.stringify({ blocked }) });
}

export async function deleteAdminUser(id: string) {
  const endpoint = process.env.NEXT_PUBLIC_ADMIN_DELETE_ENDPOINT ? process.env.NEXT_PUBLIC_ADMIN_DELETE_ENDPOINT.replace('[id]', encodeURIComponent(id)) : `/admin/users/${encodeURIComponent(id)}`;
  return apiRequest<{ success?: boolean }>(endpoint, { method: 'DELETE' });
}

export function rejectAdminApplication(id: string | number) {
  const endpoint = process.env.NEXT_PUBLIC_ADMIN_REJECT_APPLICATION_ENDPOINT ? process.env.NEXT_PUBLIC_ADMIN_REJECT_APPLICATION_ENDPOINT.replace('[id]', encodeURIComponent(String(id))) : `/admin/applications/${id}/status`;
  return apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify({ status: 'REJECTED' }) });
}

export function deleteAdminApplication(id: string | number) {
  const endpoint = process.env.NEXT_PUBLIC_ADMIN_DELETE_APPLICATION_ENDPOINT ? process.env.NEXT_PUBLIC_ADMIN_DELETE_APPLICATION_ENDPOINT.replace('[id]', encodeURIComponent(String(id))) : `/admin/applications/${id}`;
  return apiRequest(endpoint, { method: 'DELETE' });
}

export function isAdminUser(user?: AdminUser | null) {
  const role = user?.role?.trim().toUpperCase();
  if (!role) return false;
  const configuredRoles = process.env.NEXT_PUBLIC_ADMIN_ROLES?.split(',').map((item) => item.trim().toUpperCase()).filter(Boolean);
  const allowedRoles = configuredRoles?.length ? configuredRoles : ['ADMIN', 'SUPER_ADMIN', 'SYSTEM_ADMIN'];
  return allowedRoles.includes(role);
}

export async function markAdminNotificationsRead() {
  return apiRequest<{ success?: boolean; updated?: number }>('/admin/notifications/read', { method: 'PATCH', body: '{}' });
}

export async function setCompanyApproval(id: string, approved: boolean) {
  const endpoint = `/admin/companies/${encodeURIComponent(id)}/approval`;
  return apiRequest<{ success?: boolean; approved?: boolean; userId?: string }>(endpoint, { method: 'PATCH', body: JSON.stringify({ approved }) });
}

export async function updateAdminAccount(payload: { email?: string; currentPassword?: string; newPassword?: string }) {
  return apiRequest<{ success?: boolean; user?: AdminUser }>('/admin/account', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getAdminUserLabel(user?: AdminUser | null) {
  if (!user) return 'Administrateur';
  return user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Administrateur';
}
