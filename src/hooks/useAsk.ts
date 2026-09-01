import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { ASK_ENDPOINTS } from '../api/constants';
import type { AskRequest, AskResponse, AskSessionDetail, AskSessionSummary } from '../api/types';

export const askKeys = {
  all: ['ask'] as const,
  sessions: () => [...askKeys.all, 'sessions'] as const,
  session: (sessionId: string) => [...askKeys.all, 'sessions', sessionId] as const,
};

// Ask a question — creates a new session when session_id is omitted, otherwise continues it
export const useAsk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AskRequest) => {
      const { data } = await apiClient.post<AskResponse>(ASK_ENDPOINTS.ASK, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: askKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: askKeys.session(data.session_id) });
    },
  });
};

// The caller's Ask sessions, most recently active first
export const useAskSessions = () => {
  return useQuery({
    queryKey: askKeys.sessions(),
    queryFn: async () => {
      const { data } = await apiClient.get<AskSessionSummary[]>(ASK_ENDPOINTS.SESSIONS);
      return data;
    },
    staleTime: 30 * 1000,
  });
};

// Full message history for one owned session
export const useAskSession = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: askKeys.session(sessionId ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<AskSessionDetail>(ASK_ENDPOINTS.SESSION(sessionId!));
      return data;
    },
    enabled: !!sessionId,
    retry: false,
  });
};

export const useDeleteAskSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await apiClient.delete(ASK_ENDPOINTS.SESSION(sessionId));
      return sessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.invalidateQueries({ queryKey: askKeys.sessions() });
      queryClient.removeQueries({ queryKey: askKeys.session(sessionId) });
    },
  });
};
