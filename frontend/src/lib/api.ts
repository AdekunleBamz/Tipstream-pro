// ============================================================================
// API Helpers - HTTP client utilities
// ============================================================================

/**
 * HTTP response with typed data
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  headers: Headers;
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
  status: number;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  withCredentials?: boolean;
}

/**
 * Default configuration
 */
const defaultConfig: RequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retry: 3,
  retryDelay: 1000,
  withCredentials: false,
};

// ============================================================================
// HTTP Client
// ============================================================================

class HttpClient {
  private config: RequestConfig;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: RequestConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Create request headers
   */
  private createHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...this.config.headers,
      ...customHeaders,
    });
    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const baseURL = this.config.baseURL || '';
    const url = new URL(endpoint, baseURL.startsWith('http') ? baseURL : `http://localhost${baseURL}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Return relative URL if baseURL doesn't start with http
    if (!baseURL.startsWith('http')) {
      return `${baseURL}${endpoint}${url.search}`;
    }

    return url.toString();
  }

  /**
   * Execute request with retry logic
   */
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const maxRetries = this.config.retry || 0;
    const retryDelay = this.config.retryDelay || 1000;

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const requestId = `${Date.now()}-${Math.random()}`;
      this.abortControllers.set(requestId, controller);

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: this.config.withCredentials ? 'include' : 'same-origin',
      });

      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);

      const contentType = response.headers.get('content-type');
      let data: T | null = null;

      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        const error: ApiError = {
          message: (data as any)?.message || response.statusText,
          code: (data as any)?.code || 'REQUEST_FAILED',
          details: (data as any)?.details,
          status: response.status,
        };

        return {
          data: null,
          error,
          status: response.status,
          headers: response.headers,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      // Retry on network errors
      if (retryCount < maxRetries && error instanceof Error && error.name !== 'AbortError') {
        await sleep(retryDelay * Math.pow(2, retryCount));
        return this.executeRequest<T>(url, options, retryCount + 1);
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error && error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
        status: 0,
      };

      return {
        data: null,
        error: apiError,
        status: 0,
        headers: new Headers(),
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, params);
    return this.executeRequest<T>(url, {
      method: 'GET',
      headers: this.createHeaders(headers),
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.executeRequest<T>(url, {
      method: 'POST',
      headers: this.createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.executeRequest<T>(url, {
      method: 'PUT',
      headers: this.createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.executeRequest<T>(url, {
      method: 'PATCH',
      headers: this.createHeaders(headers),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint);
    return this.executeRequest<T>(url, {
      method: 'DELETE',
      headers: this.createHeaders(headers),
    });
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    this.abortControllers.forEach((controller) => {
      controller.abort();
    });
    this.abortControllers.clear();
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create query string from object
 */
export function createQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(
  queryString: string
): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Encode object for URL-safe transmission
 */
export function encodeParams(
  params: Record<string, unknown>
): string {
  return btoa(JSON.stringify(params));
}

/**
 * Decode URL-safe encoded params
 */
export function decodeParams<T>(encoded: string): T | null {
  try {
    return JSON.parse(atob(encoded)) as T;
  } catch {
    return null;
  }
}

// ============================================================================
// Pre-configured API Clients
// ============================================================================

/**
 * Default API client
 */
export const api = new HttpClient();

/**
 * Create custom API client
 */
export function createApiClient(config: RequestConfig): HttpClient {
  return new HttpClient(config);
}

/**
 * API client with authentication
 */
export function createAuthenticatedClient(
  getToken: () => string | null | Promise<string | null>
): {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data?: unknown) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data?: unknown) => Promise<ApiResponse<T>>;
  patch: <T>(endpoint: string, data?: unknown) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string) => Promise<ApiResponse<T>>;
} {
  const client = new HttpClient();

  const withAuth = async (): Promise<Record<string, string>> => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    get: async <T>(
      endpoint: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => {
      const headers = await withAuth();
      return client.get<T>(endpoint, params, headers);
    },
    post: async <T>(endpoint: string, data?: unknown) => {
      const headers = await withAuth();
      return client.post<T>(endpoint, data, headers);
    },
    put: async <T>(endpoint: string, data?: unknown) => {
      const headers = await withAuth();
      return client.put<T>(endpoint, data, headers);
    },
    patch: async <T>(endpoint: string, data?: unknown) => {
      const headers = await withAuth();
      return client.patch<T>(endpoint, data, headers);
    },
    delete: async <T>(endpoint: string) => {
      const headers = await withAuth();
      return client.delete<T>(endpoint, headers);
    },
  };
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Check if response is successful
 */
export function isSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.error === null && response.data !== null;
}

/**
 * Check if response is error
 */
export function isError<T>(response: ApiResponse<T>): response is ApiResponse<T> & { error: ApiError } {
  return response.error !== null;
}

/**
 * Unwrap response data or throw
 */
export function unwrap<T>(response: ApiResponse<T>): T {
  if (isError(response)) {
    throw new Error(response.error.message);
  }
  if (response.data === null) {
    throw new Error('No data in response');
  }
  return response.data;
}

/**
 * Unwrap response or return default
 */
export function unwrapOr<T>(response: ApiResponse<T>, defaultValue: T): T {
  if (isSuccess(response)) {
    return response.data;
  }
  return defaultValue;
}

export default api;
