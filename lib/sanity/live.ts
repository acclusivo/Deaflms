import { client } from './client';

/**
 * Robust data fetcher for DeafLMS content lake
 * Connects directly to Sanity Project u7ai9rb7 (production dataset)
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: typeof revalidate === 'number' ? revalidate : undefined,
      tags,
    },
  });
}
