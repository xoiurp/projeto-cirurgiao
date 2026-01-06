import { apiClient } from './client';
import * as tus from 'tus-js-client';
import type {
  Video,
  CreateVideoDto,
  UpdateVideoDto,
  ReorderVideosDto,
  UploadUrlResponse,
} from '../types/course.types';

// Interface para resposta do upload direto
export interface DirectUploadResponse {
  uploadURL: string;
  uid: string;
  videoId: string;
  video: Video;
}

// Interface para status de upload
export interface UploadStatusResponse {
  id: string;
  uploadStatus: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'READY' | 'ERROR';
  uploadProgress: number;
  uploadError: string | null;
  cloudflareId: string | null;
  cloudflareUrl: string | null;
  readyToStream: boolean;
}

/**
 * Serviço para gerenciamento de vídeos
 */
export const videosService = {
  /**
   * Criar um novo vídeo
   */
  async create(moduleId: string, data: CreateVideoDto): Promise<Video> {
    const response = await apiClient.post<Video>(`/modules/${moduleId}/videos`, data);
    return response.data;
  },

  /**
   * Listar vídeos de um módulo
   */
  async findAll(moduleId: string): Promise<Video[]> {
    const response = await apiClient.get<Video[]>(`/modules/${moduleId}/videos`);
    return response.data;
  },

  /**
   * Listar vídeos de um módulo (alias para findAll)
   */
  async list(moduleId: string): Promise<Video[]> {
    return this.findAll(moduleId);
  },

  /**
   * Obter URL de upload do Cloudflare Stream
   */
  async getUploadUrl(): Promise<UploadUrlResponse> {
    const response = await apiClient.post<UploadUrlResponse>('/videos/upload-url');
    return response.data;
  },

  /**
   * Upload de vídeo via backend (streaming para Cloudflare)
   * O arquivo é enviado para o backend que faz streaming para o Cloudflare
   * Isso evita problemas de CORS e suporta arquivos grandes
   */
  async uploadFile(
    moduleId: string,
    file: File,
    metadata: {
      title: string;
      description?: string;
      order: number;
    },
    onProgress?: (progress: number) => void
  ): Promise<Video> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    formData.append('order', metadata.order.toString());

    const response = await apiClient.post<Video>(
      `/modules/${moduleId}/videos/upload-file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );
    return response.data;
  },

  /**
   * Obter próxima ordem disponível para um módulo
   */
  async getNextOrder(moduleId: string): Promise<{ nextOrder: number }> {
    const response = await apiClient.get<{ nextOrder: number }>(
      `/modules/${moduleId}/videos/next-order`
    );
    return response.data;
  },

  /**
   * Reordenar vídeos de um módulo
   */
  async reorder(moduleId: string, data: ReorderVideosDto): Promise<Video[]> {
    const response = await apiClient.patch<Video[]>(
      `/modules/${moduleId}/videos/reorder`,
      data
    );
    return response.data;
  },

  /**
   * Buscar vídeo por ID
   */
  async findOne(id: string): Promise<Video> {
    const response = await apiClient.get<Video>(`/videos/${id}`);
    return response.data;
  },

  /**
   * Obter URL de streaming do vídeo para o player
   */
  async getStreamUrl(id: string): Promise<{ cloudflareId: string; cloudflareUrl: string }> {
    const video = await this.findOne(id);
    
    if (!video.cloudflareId || !video.cloudflareUrl) {
      throw new Error('Vídeo ainda não está disponível para streaming');
    }
    
    if (!video.isPublished) {
      throw new Error('Este vídeo não está publicado');
    }
    
    return {
      cloudflareId: video.cloudflareId,
      cloudflareUrl: video.cloudflareUrl,
    };
  },

  /**
   * Atualizar vídeo
   */
  async update(id: string, data: UpdateVideoDto): Promise<Video> {
    const response = await apiClient.patch<Video>(`/videos/${id}`, data);
    return response.data;
  },

  /**
   * Deletar vídeo
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/videos/${id}`);
  },

  /**
   * Publicar/despublicar vídeo
   */
  async togglePublish(id: string): Promise<Video> {
    const response = await apiClient.patch<Video>(`/videos/${id}/toggle-publish`);
    return response.data;
  },

  /**
   * Sincronizar metadados do vídeo com Cloudflare
   */
  async sync(id: string): Promise<Video> {
    const response = await apiClient.post<Video>(`/videos/${id}/sync`);
    return response.data;
  },

  /**
   * Verificar status de upload de um vídeo
   */
  async getUploadStatus(id: string): Promise<UploadStatusResponse> {
    const response = await apiClient.get<UploadStatusResponse>(`/videos/${id}/upload-status`);
    return response.data;
  },

  /**
   * Obter URL de upload direto para TUS
   * Cria o registro do vídeo no banco e retorna a URL de upload direta do Cloudflare
   */
  async getDirectUploadUrl(
    moduleId: string,
    metadata: { title: string; description?: string; order: number }
  ): Promise<DirectUploadResponse> {
    const response = await apiClient.post<DirectUploadResponse>(
      `/modules/${moduleId}/videos/upload-url-direct`,
      metadata
    );
    return response.data;
  },

  /**
   * Upload de vídeo via backend usando XMLHttpRequest (sem timeout)
   * O backend recebe o arquivo e faz upload TUS para Cloudflare em background
   * XMLHttpRequest não tem timeout padrão, permitindo uploads muito grandes
   */
  async uploadVideoTusDirect(
    moduleId: string,
    file: File,
    metadata: { title: string; description?: string; order: number },
    onProgress?: (progress: number) => void,
    onStatusChange?: (status: 'preparing' | 'uploading' | 'processing' | 'done' | 'error', message?: string) => void
  ): Promise<Video> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    
    return new Promise((resolve, reject) => {
      onStatusChange?.('preparing', 'Preparando upload...');
      console.log('[Backend Upload] Starting upload via backend');
      console.log('[Backend Upload] File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title);
      if (metadata.description) {
        formData.append('description', metadata.description);
      }
      formData.append('order', metadata.order.toString());

      const xhr = new XMLHttpRequest();
      
      // Evento de progresso do upload
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          // Mapear progresso HTTP (0-100%) para fase 1 (0-50%)
          // O backend faz TUS em background (fase 2: 50-100%)
          const httpProgress = (event.loaded / event.total) * 100;
          const mappedProgress = httpProgress * 0.5; // 0-50%
          console.log(`[Backend Upload] HTTP Progress: ${httpProgress.toFixed(2)}% -> Mapped: ${mappedProgress.toFixed(2)}%`);
          onProgress?.(mappedProgress);
          
          if (httpProgress >= 100) {
            onStatusChange?.('processing', 'Arquivo recebido! Backend processando...');
          }
        }
      });
      
      // Evento de conclusão
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const video = JSON.parse(xhr.responseText) as Video;
            console.log('[Backend Upload] Upload completed. Video ID:', video.id);
            onStatusChange?.('processing', 'Upload concluído! Cloudflare processando...');
            onProgress?.(50); // 50% - Backend recebeu, agora é TUS em background
            resolve(video);
          } catch (e) {
            console.error('[Backend Upload] Failed to parse response');
            reject(new Error('Erro ao processar resposta do servidor'));
          }
        } else {
          console.error('[Backend Upload] Failed:', xhr.status, xhr.responseText);
          let errorMsg = 'Erro no upload';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          onStatusChange?.('error', errorMsg);
          reject(new Error(errorMsg));
        }
      });
      
      // Evento de erro de rede
      xhr.addEventListener('error', () => {
        console.error('[Backend Upload] Network error');
        onStatusChange?.('error', 'Erro de rede. Verifique sua conexão.');
        reject(new Error('Erro de rede. Verifique sua conexão e tente novamente.'));
      });
      
      // Evento de abort
      xhr.addEventListener('abort', () => {
        console.log('[Backend Upload] Aborted');
        onStatusChange?.('error', 'Upload cancelado');
        reject(new Error('Upload cancelado'));
      });
      
      // Configurar e enviar requisição
      // IMPORTANTE: XMLHttpRequest não tem timeout padrão (infinito)
      const token = localStorage.getItem('accessToken');
      xhr.open('POST', `${API_BASE_URL}/modules/${moduleId}/videos/upload-file`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      onStatusChange?.('uploading', 'Enviando para servidor...');
      console.log('[Backend Upload] Sending to:', `${API_BASE_URL}/modules/${moduleId}/videos/upload-file`);
      xhr.send(formData);
    });
  },

  /**
   * Polling de status de upload até completar ou falhar
   * @param id ID do vídeo
   * @param onProgress Callback chamado a cada atualização de progresso
   * @param intervalMs Intervalo entre verificações (padrão: 2000ms)
   * @param maxAttempts Número máximo de tentativas (padrão: 300 = 10 minutos)
   */
  async pollUploadStatus(
    id: string,
    onProgress?: (status: UploadStatusResponse) => void,
    intervalMs = 2000,
    maxAttempts = 300
  ): Promise<UploadStatusResponse> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          attempts++;
          const status = await this.getUploadStatus(id);
          
          // Chamar callback de progresso
          if (onProgress) {
            onProgress(status);
          }
          
          // Verificar se completou ou falhou
          if (status.uploadStatus === 'READY') {
            resolve(status);
            return;
          }
          
          if (status.uploadStatus === 'ERROR') {
            reject(new Error(status.uploadError || 'Erro no upload do vídeo'));
            return;
          }
          
          // Verificar limite de tentativas
          if (attempts >= maxAttempts) {
            reject(new Error('Timeout: Upload demorou muito para completar'));
            return;
          }
          
          // Continuar polling
          setTimeout(checkStatus, intervalMs);
        } catch (error) {
          reject(error);
        }
      };
      
      // Iniciar polling
      checkStatus();
    });
  },
};
