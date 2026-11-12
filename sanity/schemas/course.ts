import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Course Schema
 * 
 * Represents a complete educational course in DeafLMS:
 * - DHH children literacy & digital skills
 * - Deaf adults frontend web development (HTML, CSS, JS in NSL)
 * - Hearing learners conversational Nigerian Sign Language
 */
export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      description: 'E.g., "Computer & Digital Literacy in Sign Language"',
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
      name: 'description',
      title: 'Course Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Subject Category',
      type: 'string',
      options: {
        list: [
          { title: 'Digital Literacy', value: 'Digital Literacy' },
          { title: 'Frontend Web Development (Adult Track)', value: 'Frontend Web Development' },
          { title: 'Conversational NSL (Hearing Learner Track)', value: 'Conversational NSL' },
          { title: 'Reading & Literacy', value: 'Reading & Literacy' },
          { title: 'STEM & Science', value: 'STEM' },
          { title: 'Everyday Signs', value: 'Everyday Signs' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetAudience',
      title: 'Primary Target Learner Track',
      type: 'string',
      initialValue: 'deaf_child',
      options: {
        list: [
          { title: 'Deaf Child (Ages 8–16)', value: 'deaf_child' },
          { title: 'Deaf Adult (Digital Skills & Career)', value: 'deaf_adult' },
          { title: 'Hearing Learner (Learning NSL)', value: 'hearing_learner' },
          { title: 'General / All Learners', value: 'general' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gradeLevel',
      title: 'Grade / Target Level',
      type: 'string',
      description: 'E.g., "Primary 3-6", "Adult Beginner", "Career Entry"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Course Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'signLanguage',
      title: 'Primary Instructional Sign Language',
      type: 'string',
      initialValue: 'NSL',
      options: {
        list: [
          { title: 'Nigerian Sign Language (NSL)', value: 'NSL' },
          { title: 'Korean Sign Language (KRSL)', value: 'KRSL' },
          { title: 'Kenyan Sign Language (KSL)', value: 'KSL' },
          { title: 'Ghanaian Sign Language (GSL)', value: 'GSL' },
          { title: 'American Sign Language (ASL)', value: 'ASL' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isPublished',
      title: 'Published to Learners',
      type: 'boolean',
      initialValue: true,
      description: 'Only published courses appear on learner dashboards and course lists.',
    }),
    defineField({
      name: 'isFreeTier',
      title: 'Free Basic Tier Course',
      type: 'boolean',
      initialValue: false,
      description: 'Check if this course is completely free without requiring an upgraded subscription.',
    }),
    defineField({
      name: 'priceNgn',
      title: 'Course Price (NGN) — For Paid Courses',
      type: 'number',
      initialValue: 0,
      description: 'Leave 0 for Free courses. For paid supporter courses, enter amount in Naira (e.g. 5000).',
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Total Estimated Duration (Minutes)',
      type: 'number',
      initialValue: 45,
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name',
      type: 'string',
      initialValue: 'Laptop',
      options: {
        list: [
          { title: 'Laptop (Digital Literacy)', value: 'Laptop' },
          { title: 'Code (Web Development)', value: 'Code' },
          { title: 'BookOpen (Reading / Literacy)', value: 'BookOpen' },
          { title: 'HandMetal (Sign Language)', value: 'HandMetal' },
          { title: 'Rocket (STEM / Exploration)', value: 'Rocket' },
          { title: 'Sparkles (Foundational)', value: 'Sparkles' },
        ],
      },
    }),
    defineField({
      name: 'modules',
      title: 'Course Modules',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'courseModule' }] }],
      description: 'Ordered sequence of modules in this course.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
      isFree: 'isFreeTier',
      published: 'isPublished',
    },
    prepare({ title, category, media, isFree, published }) {
      return {
        title,
        subtitle: `${category} • ${isFree ? 'Free' : 'Paid'} • ${published ? '🟢 Published' : '🔒 Draft'}`,
        media,
      };
    },
  },
});
