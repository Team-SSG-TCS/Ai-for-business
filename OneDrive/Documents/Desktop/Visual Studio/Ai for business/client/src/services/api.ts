import axios from 'axios';
import type { ApiResponse, AiChatRequest, AiChatResponse } from '../types';

export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
export const AI_BASE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

export const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend API helpers
export const checkBackendHealth = async () => {
  const start = performance.now();
  const res = await backendApi.get<ApiResponse>('/health');
  const latency = Math.round(performance.now() - start);
  return { ...res.data, latency };
};

export const checkDatabaseHealth = async () => {
  const res = await backendApi.get<ApiResponse<{ connected: boolean; timestamp?: string }>>(
    '/health/db'
  );
  return res.data;
};

// AI Service API helpers
export const checkAiServiceHealth = async () => {
  const start = performance.now();
  const res = await aiApi.get<{ status: string; service: string }>('/health');
  const latency = Math.round(performance.now() - start);
  return { ...res.data, latency };
};

export const sendAiPrompt = async (data: AiChatRequest): Promise<AiChatResponse> => {
  const res = await aiApi.post<AiChatResponse>('/api/v1/chat', data);
  return res.data;
};

// RAG API helpers (Supabase pgvector + Express + AI Service)
export const getRagStatus = async () => {
  const res = await backendApi.get('/rag/status');
  return res.data;
};

export const getRagDocuments = async (limit = 10) => {
  const res = await backendApi.get(`/rag/documents?limit=${limit}`);
  return res.data;
};

export const addRagDocument = async (data: {
  title: string;
  content: string;
  source?: string;
  metadata?: Record<string, unknown>;
}) => {
  const res = await backendApi.post('/rag/documents', data);
  return res.data;
};

export const searchRagDocuments = async (query_text: string, match_count = 3) => {
  const res = await backendApi.post('/rag/search', {
    query_text,
    match_count,
  });
  return res.data;
};

export const askRagQuestion = async (query: string, match_count = 3) => {
  const res = await backendApi.post('/rag/ask', {
    query,
    match_count,
  });
  return res.data;
};

