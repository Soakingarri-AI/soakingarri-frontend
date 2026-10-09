import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { UPLOAD_ENDPOINTS } from '../api/constants';
import type { Attachment, AttachmentDetail, UploadLimits } from '../api/types';

export const uploadKeys = {
  all: ['uploads'] as const,
  limits: () => [...uploadKeys.all, 'limits'] as const,
  lists: () => [...uploadKeys.all, 'list'] as const,
  list: (sessionId?: string) => [...uploadKeys.lists(), sessionId ?? 'all'] as const,
  detail: (attachmentId: string) => [...uploadKeys.all, 'detail', attachmentId] as const,
  content: (attachmentId: string) => [...uploadKeys.all, 'content', attachmentId] as const,
};

const fetchContent = async (attachmentId: string) => {
  const { data } = await apiClient.get<Blob>(UPLOAD_ENDPOINTS.CONTENT(attachmentId), {
    responseType: 'blob',
  });
  return data;
};

// What the composer may send, and how much of the quota is already used
export const useUploadLimits = () => {
  return useQuery({
    queryKey: uploadKeys.limits(),
    queryFn: async () => {
      const { data } = await apiClient.get<UploadLimits>(UPLOAD_ENDPOINTS.LIMITS);
      return data;
    },
    staleTime: 60 * 1000,
  });
};

// The caller's uploads, newest first; optionally scoped to one session
export const useUploads = (sessionId?: string) => {
  return useQuery({
    queryKey: uploadKeys.list(sessionId),
    queryFn: async () => {
      const { data } = await apiClient.get<Attachment[]>(UPLOAD_ENDPOINTS.UPLOADS, {
        params: sessionId ? { session_id: sessionId } : undefined,
      });
      return data;
    },
  });
};

export const useAttachment = (attachmentId: string | undefined) => {
  return useQuery({
    queryKey: uploadKeys.detail(attachmentId ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<AttachmentDetail>(UPLOAD_ENDPOINTS.UPLOAD(attachmentId!));
      return data;
    },
    enabled: !!attachmentId,
  });
};

// The stored bytes, for thumbnails. An <img src> can't carry the Authorization
// header, so callers turn the blob into an object URL themselves.
export const useAttachmentContent = (attachmentId: string, enabled = true) => {
  return useQuery({
    queryKey: uploadKeys.content(attachmentId),
    queryFn: () => fetchContent(attachmentId),
    enabled,
    staleTime: Infinity,
    retry: false,
  });
};

interface UploadFileVars {
  file: File;
  onProgress?: (percent: number) => void;
}

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, onProgress }: UploadFileVars) => {
      const body = new FormData();
      body.append('file', file);
      const { data } = await apiClient.post<AttachmentDetail>(UPLOAD_ENDPOINTS.UPLOADS, body, {
        // The client defaults to JSON, which would make axios serialize the
        // FormData as JSON. Naming multipart lets the browser add the boundary.
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      return data;
    },
    onSuccess: (data, { file }) => {
      // We already hold the bytes — seed the cache so thumbnails don't re-download them.
      queryClient.setQueryData(uploadKeys.content(data.id), file);
      queryClient.setQueryData(uploadKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: uploadKeys.limits() });
      queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
    },
  });
};

// Removes the file and its bytes; messages keep their text record
export const useDeleteUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachmentId: string) => {
      await apiClient.delete(UPLOAD_ENDPOINTS.UPLOAD(attachmentId));
      return attachmentId;
    },
    onSuccess: (attachmentId) => {
      queryClient.removeQueries({ queryKey: uploadKeys.detail(attachmentId) });
      queryClient.removeQueries({ queryKey: uploadKeys.content(attachmentId) });
      queryClient.invalidateQueries({ queryKey: uploadKeys.limits() });
      queryClient.invalidateQueries({ queryKey: uploadKeys.lists() });
    },
  });
};

// Saves the original file to disk, reusing cached bytes when we have them
export const useDownloadAttachment = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (attachmentId: string, filename: string) => {
      const blob = await queryClient.fetchQuery({
        queryKey: uploadKeys.content(attachmentId),
        queryFn: () => fetchContent(attachmentId),
        staleTime: Infinity,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      // Give the browser a tick to start the download before freeing the bytes.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    [queryClient]
  );
};
