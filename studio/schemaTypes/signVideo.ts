import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Verified Sign Language Video Schema
 * 
 * Manages human-reviewed sign language demonstrations with reviewer metadata,
 * chest-space framing verification, and regional school dialect variants.
 */
export const signVideo = defineType({
  name: 'signVideo',
  title: 'Sign Language Video Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
      description: 'E.g., "Webcam — Nigerian Sign Language Demonstration"',
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Source URL',
      type: 'url',
      description: 'Direct MP4, YouTube, or Mux playback URL with clear upper-body and hand visibility.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux Playback ID',
      type: 'string',
      description: 'Optional Mux playback ID for adaptive bitrate streaming.',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster / Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      description: 'First-frame still image showing the signer in resting position.',
    }),
    defineField({
      name: 'signLanguage',
      title: 'Sign Language Standard',
      type: 'string',
      initialValue: 'NSL',
      options: {
        list: [
          { title: 'Nigerian Sign Language (NSL) — Primary Launch Track', value: 'NSL' },
          { title: 'Korean Sign Language (KRSL) — Pilot Expansion', value: 'KRSL' },
          { title: 'Kenyan Sign Language (KSL) — Planned', value: 'KSL' },
          { title: 'Ghanaian Sign Language (GSL) — Planned', value: 'GSL' },
          { title: 'American Sign Language (ASL) — Planned', value: 'ASL' },
          { title: 'British Sign Language (BSL) — Planned', value: 'BSL' },
          { title: 'International Sign (IS) — Planned', value: 'IS' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'regionalVariant',
      title: 'Regional Dialect / School Cluster',
      type: 'string',
      description: 'E.g., "Abuja School & Community Variant", "Lagos Urban", "Kogi Regional"',
      initialValue: 'Abuja School & Community Variant',
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (Seconds)',
      type: 'number',
      initialValue: 60,
    }),
    defineField({
      name: 'signerName',
      title: 'Certified Deaf Educator / Signer',
      type: 'string',
      description: 'Name of the human native Deaf signer who demonstrated this sign.',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Accredited Review Team / Authority',
      type: 'string',
      initialValue: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
      description: 'Name of the community Deaf panel or institution that reviewed and approved this sign.',
    }),
    defineField({
      name: 'reviewStatus',
      title: 'Review Status',
      type: 'string',
      initialValue: 'approved',
      options: {
        list: [
          { title: 'Draft (Not Yet Visible to Learners)', value: 'draft' },
          { title: 'Under Community Review', value: 'reviewed' },
          { title: 'Approved for Published Curriculum', value: 'approved' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pedagogicalNotes',
      title: 'Sign Production Guidance Notes',
      type: 'text',
      rows: 3,
      description: 'Details on handshape, movement, location, or non-manual facial markers.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'signLanguage',
      media: 'posterImage',
      status: 'reviewStatus',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${subtitle} • Status: ${status}`,
        media,
      };
    },
  },
});
