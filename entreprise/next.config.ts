import type { NextConfig } from "next";

const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_SESSION_ENDPOINT: process.env.NEXT_PUBLIC_SESSION_ENDPOINT || '/auth/me',
    NEXT_PUBLIC_DASHBOARD_ENDPOINT: process.env.NEXT_PUBLIC_DASHBOARD_ENDPOINT || '/company/dashboard',
    NEXT_PUBLIC_COMPANY_JOBS_ENDPOINT: process.env.NEXT_PUBLIC_COMPANY_JOBS_ENDPOINT || '/company/jobs',
    NEXT_PUBLIC_COMPANY_APPLICATIONS_ENDPOINT: process.env.NEXT_PUBLIC_COMPANY_APPLICATIONS_ENDPOINT || '/company/applications',
    NEXT_PUBLIC_CREATE_JOB_ENDPOINT: process.env.NEXT_PUBLIC_CREATE_JOB_ENDPOINT || '/company/jobs',
    NEXT_PUBLIC_REGISTER_ENDPOINT: process.env.NEXT_PUBLIC_REGISTER_ENDPOINT || '/auth/register/company',
    NEXT_PUBLIC_LOGIN_ENDPOINT: process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || '/auth/login/company',
    NEXT_PUBLIC_CANDIDATE_JOBS_ENDPOINT: process.env.NEXT_PUBLIC_CANDIDATE_JOBS_ENDPOINT || '/jobs',
    NEXT_PUBLIC_CANDIDATE_REGISTER_ENDPOINT: process.env.NEXT_PUBLIC_CANDIDATE_REGISTER_ENDPOINT || '/auth/register/candidate',
    NEXT_PUBLIC_CANDIDATE_APPLICATIONS_ENDPOINT: process.env.NEXT_PUBLIC_CANDIDATE_APPLICATIONS_ENDPOINT || '/applications/me',
    NEXT_PUBLIC_CANDIDATE_APPLICATION_ENDPOINT: process.env.NEXT_PUBLIC_CANDIDATE_APPLICATION_ENDPOINT || '/applications/jobs',
    NEXT_PUBLIC_CANDIDATE_PROFILE_ENDPOINT: process.env.NEXT_PUBLIC_CANDIDATE_PROFILE_ENDPOINT || '/candidate/profile',
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: apiOrigin.protocol === 'https:' ? 'https' : 'http',
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
