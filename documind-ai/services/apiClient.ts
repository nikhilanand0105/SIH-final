// Central API client for all backend communication
// Currently a stub that returns mock data
// TODO: Replace with real HTTP client (fetch/axios) when backend is ready

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { method?: string }
): Promise<T> {
  // TODO: Implement real fetch call
  // const url = `${API_BASE_URL}${endpoint}`;
  // const response = await fetch(url, {
  //   headers: { 'Content-Type': 'application/json' },
  //   ...options,
  // });
  // if (!response.ok) throw new Error(`API error: ${response.status}`);
  // return response.json();

  console.warn(`API call (mock): ${options?.method || 'GET'} ${endpoint}`);
  throw new Error('Backend not available - API client is a stub');
}

export async function postApi<T>(
  endpoint: string,
  data: any,
  options?: RequestInit
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

export async function getApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'GET',
    ...options,
  });
}

export async function deleteApi(endpoint: string, options?: RequestInit): Promise<void> {
  return fetchApi<void>(endpoint, {
    method: 'DELETE',
    ...options,
  });
}
