export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * On the browser every call goes through the Next.js rewrite proxy, so the
 * Better Auth cookie stays same-origin. On the server we talk to the API
 * directly and must forward cookies manually when needed.
 */
function resolveBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  return process.env.API_ORIGIN ?? 'http://localhost:3001';
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { cookie?: string },
): Promise<T> {
  const { cookie, headers, ...rest } = init ?? {};

  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { 'content-type': 'application/json' } : {}),
      ...(cookie ? { cookie } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const detail = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? response.statusText);

    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function toQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : '';
}
