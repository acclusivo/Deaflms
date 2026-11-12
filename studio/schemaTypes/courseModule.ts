import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Course Module Schema
 * 
 * Groups related lessons together (e.g. "Module 1: Getting Started with Computer Parts"
 * or "Module 2: HTML Tags & Document Structure in NSL").
 */
export const courseModule = defineType({
  name: 'courseModule',
  title: 'Course Module',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      description: 'E.g., "Module 1: Computer Hardware & Touching the Keyboard"',
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
      name: 'orderIndex',
      title: 'Module Order Number',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer(),
    }),
    defineField({
      name: 'description',
      title: 'Module Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons in this Module',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lesson' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'orderIndex',
    },
    prepare({ title, order }) {
      return {
        title: `Module ${order}: ${title}`,
      };
    },
  },
});
