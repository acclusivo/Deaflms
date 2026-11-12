import { defineType, defineField } from 'sanity';

/**
 * DeafLMS — Approved Vocabulary Item Schema
 * 
 * Implements the 5-step visual progression:
 * 1. Physical Object Picture
 * 2. Vocabulary Sign Video (How to sign the individual word)
 * 3. Signed Meaning Video (How a Deaf educator explains the concept)
 * 4. Simple Written Meaning & Example Sentence
 * 5. Sequential Visual Story & Fingerspelling Breakdown
 */
export const vocabularyItem = defineType({
  name: 'vocabularyItem',
  title: 'Approved Vocabulary Item',
  type: 'document',
  fields: [
    defineField({
      name: 'word',
      title: 'Vocabulary Word',
      type: 'string',
      description: 'E.g., "Webcam", "Keyboard", "HTML", "Button", "Hello"',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'word',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Computer Hardware', value: 'computer_hardware' },
          { title: 'Digital Literacy & Navigation', value: 'digital_literacy' },
          { title: 'Frontend Web Development (HTML/CSS)', value: 'frontend_web' },
          { title: 'Everyday Signs (NSL)', value: 'everyday_signs' },
          { title: 'Conversational Greetings & Family', value: 'conversational' },
          { title: 'STEM & Science', value: 'stem' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'simpleMeaning',
      title: 'Simple Meaning (No Auditory Jargon)',
      type: 'text',
      rows: 3,
      description: 'Short, direct sentences explaining what the item is or does.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'exampleSentence',
      title: 'Everyday Example Sentence',
      type: 'string',
      description: 'A familiar sentence showing real-life usage.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fingerspelling',
      title: 'Fingerspelling Format',
      type: 'string',
      description: 'Hyphen-separated letter breakdown (e.g. "W - E - B - C - A - M")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Physical Object Photo / Diagram',
      type: 'image',
      options: { hotspot: true },
      description: 'High-contrast real-world photo or diagram (anchors visual recognition before text).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vocabularySignVideo',
      title: 'Vocabulary Sign Video (Word Sign)',
      type: 'reference',
      to: [{ type: 'signVideo' }],
      description: 'Video demonstrating how to sign the single isolated word in NSL.',
    }),
    defineField({
      name: 'signedMeaningVideo',
      title: 'Signed Meaning Video (Concept Explanation)',
      type: 'reference',
      to: [{ type: 'signVideo' }],
      description: 'Video where a Deaf educator explains what the word means in natural sign language.',
    }),
    defineField({
      name: 'visualStoryFrames',
      title: 'Visual Story Frames (Show Me)',
      type: 'array',
      of: [{ type: 'visualStoryFrame' }],
      description: 'Sequential 3-frame story illustrating the word in everyday context.',
    }),
    defineField({
      name: 'signLanguage',
      title: 'Sign Language Dialect',
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
      name: 'targetAgeMin',
      title: 'Minimum Target Age',
      type: 'number',
      initialValue: 8,
    }),
    defineField({
      name: 'targetAgeMax',
      title: 'Maximum Target Age',
      type: 'number',
      initialValue: 16,
    }),
    defineField({
      name: 'difficultyLevel',
      title: 'Difficulty Level',
      type: 'string',
      initialValue: 'beginner',
      options: {
        list: [
          { title: 'Beginner (Foundational)', value: 'beginner' },
          { title: 'Developing (Intermediate)', value: 'developing' },
          { title: 'Independent (Advanced)', value: 'independent' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'reviewStatus',
      title: 'Content Review Status',
      type: 'string',
      initialValue: 'approved',
      options: {
        list: [
          { title: 'Draft (Hidden from Learners)', value: 'draft' },
          { title: 'Needs Pedagogical Review', value: 'needs_review' },
          { title: 'Approved by Deaf Educator Panel', value: 'approved' },
          { title: 'Published to DeafLMS Catalog', value: 'published' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'string',
      initialValue: 'Acclusivo Deaf Review Team (Abuja, Nigeria)',
    }),
  ],
  preview: {
    select: {
      title: 'word',
      subtitle: 'category',
      media: 'image',
      status: 'reviewStatus',
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: `${subtitle || 'Vocabulary'} • Status: ${status}`,
        media,
      };
    },
  },
});
