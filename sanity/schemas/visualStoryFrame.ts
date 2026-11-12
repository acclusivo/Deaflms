import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Sequential Visual Story Frame Object Schema
 * 
 * Used within vocabulary items and lessons to provide 3-frame sequential
 * visual narratives that connect physical objects to real-world usage.
 */
export const visualStoryFrame = defineType({
  name: 'visualStoryFrame',
  title: 'Visual Story Frame',
  type: 'object',
  fields: [
    defineField({
      name: 'order',
      title: 'Frame Order',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(10),
    }),
    defineField({
      name: 'image',
      title: 'Story Frame Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Simple Caption',
      type: 'string',
      description: 'Short 1-sentence description using everyday words (e.g. "I sit near the webcam.")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Visual Accessibility Alt Text',
      type: 'string',
      description: 'Detailed description for screen readers and high-contrast assistive modes.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'order',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `Frame ${subtitle}: ${title}`,
        media,
      };
    },
  },
});
