import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset, apiVersion, isSanityConfigured } from '@/sanity/env';

/**
 * Public Sanity Read Client for Learner Interfaces
 * Uses CDN edge caching for fast global retrieval.
 * NEVER uses write tokens or draft credentials in client bundles.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

/**
 * Server-Side Sanity Preview Client (Admin only)
 * Bypasses CDN to query draft content when authenticated.
 */
export function getPreviewClient(previewToken?: string) {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: previewToken || process.env.SANITY_API_READ_TOKEN,
  });
}

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  if (!source) return '';
  return builder.image(source).auto('format').fit('max').url();
}

export { isSanityConfigured };
