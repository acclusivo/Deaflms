import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Lesson Schema
 * 
 * Supports diverse lesson types across Deaf children, Deaf adults, and hearing learners:
 * - Standard visual lesson (Picture -> Sign -> Spelling -> Practice)
 * - Interactive dual-pane storybook
 * - Digital simulation / fingerspelling keyboard lab
 * - Adult frontend web development coding lab
 */
export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      description: 'E.g., "Computer Hardware Basics: The Webcam" or "Building Your First HTML Button in NSL"',
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
      name: 'lessonType',
      title: 'Lesson Format & Type',
      type: 'string',
      initialValue: 'standard_lesson',
      options: {
        list: [
          { title: 'Standard Visual Literacy Lesson (5-Step Progression)', value: 'standard_lesson' },
          { title: 'Interactive Dual-Pane Storybook', value: 'interactive_storybook' },
          { title: 'Digital Simulation & Keyboard Trainer', value: 'digital_simulation' },
          { title: 'Frontend Web Development Lab (Adult)', value: 'web_coding_lab' },
          { title: 'Conversational NSL Practice (Hearing Learner)', value: 'conversational_sign' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Learner Track',
      type: 'string',
      initialValue: 'deaf_child',
      options: {
        list: [
          { title: 'Deaf Child (Foundational Literacy & Tech)', value: 'deaf_child' },
          { title: 'Deaf Adult (Frontend Web Development)', value: 'deaf_adult' },
          { title: 'Hearing Learner (Nigerian Sign Language)', value: 'hearing_learner' },
          { title: 'General / All Learners', value: 'general' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFreeBasic1',
      title: 'Included in Free Basic 1 Tier',
      type: 'boolean',
      initialValue: false,
      description: 'Check if this lesson is permanently free without requiring payment or subscription.',
    }),
    defineField({
      name: 'orderIndex',
      title: 'Sequence Order Index',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer(),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Estimated Duration (Minutes)',
      type: 'number',
      initialValue: 10,
    }),
    defineField({
      name: 'description',
      title: 'Lesson Overview',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'learningObjectives',
      title: 'Learning Objectives',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Clear, measurable visual outcomes (e.g., "Identify the webcam in a computer setup")',
    }),
    defineField({
      name: 'heroSignVideo',
      title: 'Primary Lesson Sign Video',
      type: 'reference',
      to: [{ type: 'signVideo' }],
      description: 'The featured Nigerian Sign Language explanation for this lesson.',
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux Video Playback ID / Player URL',
      type: 'string',
      description: 'Upload sign video to Mux, then paste the Playback ID (e.g. 5mX7hKk02Z1F...) or player URL here.',
    }),
    defineField({
      name: 'vocabularyItems',
      title: 'Vocabulary Items in this Lesson',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'vocabularyItem' }] }],
      description: 'Key terms taught and practiced in this lesson.',
    }),
    defineField({
      name: 'writtenExplanation',
      title: 'Written Explanation (Rich Text)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
    }),
    defineField({
      name: 'simpleEnglishExplanation',
      title: 'Simple English Explanation (Plain Language)',
      type: 'text',
      rows: 4,
      description: 'Simplified text using basic grammar for developing readers or ESL learners.',
    }),
    defineField({
      name: 'storyPages',
      title: 'Storybook Pages (For Storybook Lessons)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'pageNumber', type: 'number', title: 'Page Number' },
            { name: 'illustration', type: 'image', title: 'Page Illustration', options: { hotspot: true } },
            { name: 'textContent', type: 'text', title: 'Story Text' },
            { name: 'signVideo', type: 'reference', to: [{ type: 'signVideo' }], title: 'Sign Video for this Page' },
          ],
        },
      ],
      hidden: ({ parent }) => parent?.lessonType !== 'interactive_storybook',
    }),
    defineField({
      name: 'quizQuestions',
      title: 'Comprehension Quiz Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionText', type: 'string', title: 'Question Text' },
            { name: 'promptSignVideo', type: 'reference', to: [{ type: 'signVideo' }], title: 'Optional Signed Question Video' },
            {
              name: 'options',
              type: 'array',
              title: 'Answer Choices',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Choice Label' },
                    { name: 'image', type: 'image', title: 'Optional Choice Image' },
                    { name: 'isCorrect', type: 'boolean', title: 'Is Correct Answer', initialValue: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'targetAudience',
      isFree: 'isFreeBasic1',
    },
    prepare({ title, subtitle, isFree }) {
      const audienceLabels: Record<string, string> = {
        deaf_child: 'Child Track',
        deaf_adult: 'Adult Frontend Track',
        hearing_learner: 'Hearing NSL Track',
        general: 'General',
      };
      return {
        title,
        subtitle: `${audienceLabels[subtitle] || subtitle} • ${isFree ? '100% Free Basic 1' : 'Supporter Tier'}`,
      };
    },
  },
});
