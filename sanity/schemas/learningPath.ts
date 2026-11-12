import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Learning Path Schema
 * 
 * Defines high-level journeys matching the three target learners:
 * 1. Deaf Child Foundational Literacy & Touch Typing
 * 2. Deaf Adult Frontend Web Development Career Track
 * 3. Hearing Learner Nigerian Sign Language Acquisition
 */
export const learningPath = defineType({
  name: 'learningPath',
  title: 'Learning Path / Track',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Path Title',
      type: 'string',
      description: 'E.g., "Frontend Web Developer in Nigerian Sign Language"',
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
      name: 'tagline',
      title: 'Short Tagline',
      type: 'string',
      description: 'E.g., "Master HTML, CSS, JavaScript and responsive design through verified sign explanations."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Learner Persona',
      type: 'string',
      options: {
        list: [
          { title: 'Deaf Child (Primary / Secondary)', value: 'deaf_child' },
          { title: 'Deaf Adult (Digital Skills & Career)', value: 'deaf_adult' },
          { title: 'Hearing Learner (NSL Communication)', value: 'hearing_learner' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Detailed Path Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'badge',
      title: 'Visual Badge / Label',
      type: 'string',
      description: 'E.g., "Career Track", "Foundational", "Family Ally"',
    }),
    defineField({
      name: 'courses',
      title: 'Courses in this Path',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'course' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'targetAudience',
      badge: 'badge',
    },
    prepare({ title, subtitle, badge }) {
      return {
        title,
        subtitle: `${subtitle} ${badge ? `• [${badge}]` : ''}`,
      };
    },
  },
});
