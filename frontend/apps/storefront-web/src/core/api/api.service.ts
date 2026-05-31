// Base API Service using Axios (SPEC_CORE_FE)
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiException } from '../exceptions/api.exception';
import { ApiResponse, ApiErrorResponse } from '../types/api.types';

export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request Interceptor: Inject Auth Headers & Logging
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor: Handle status actions & format structures
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        const data = error.response?.data as ApiErrorResponse | undefined;
        
        let code = 'NETWORK_ERROR';
        let message = 'Có lỗi kết nối xảy ra. Vui lòng thử lại.';

        if (data && data.message) {
          message = data.message;
          code = data.code || code;
        } else if (error.message) {
          message = error.message;
        }

        // Standard API Error Handling status code mapping
        switch (status) {
          case 400:
            console.error('[API 400] Validation Error:', message);
            break;
          case 401:
            console.warn('[API 401] Unauthorized - Redirecting to login...');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              window.dispatchEvent(new CustomEvent('auth-logout'));
            }
            break;
          case 403:
            console.error('[API 403] Access Denied:', message);
            break;
          case 404:
            console.error('[API 404] Not Found:', message);
            break;
          case 500:
            console.error('[API 500] Internal Server Error:', message);
            break;
          default:
            break;
        }

        return Promise.reject(new ApiException(message, code, status, error.response?.data));
      }
    );
  }

  // HTTP GET
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // HTTP POST
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // HTTP PUT
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // HTTP PATCH
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // HTTP DELETE
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Upload File Utility
  public async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await this.client.post<ApiResponse<T>>(url, formData, uploadConfig);
    return response.data;
  }
}

export const apiService = new ApiService();
