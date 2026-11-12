/**
 * DeafLMS — Sanity CMS Environment Configuration
 * 
 * Configures the Sanity Content Lake for educational content management.
 * All public variables use NEXT_PUBLIC_ prefixes.
 * Write tokens are STRICTLY server-side and never exposed to the frontend.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u7ai9rb7';

/**
 * Indicates whether live Sanity credentials are provided in the environment.
 * When false, DeafLMS operates seamlessly using local verified educational content.
 */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-sanity-project-id'
);
