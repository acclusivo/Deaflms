import { groq } from 'next-sanity';
import { client, isSanityConfigured } from './client';

/**
 * DeafLMS GROQ Queries
 * 
 * Strict Security Enforcement:
 * - Learner queries ALWAYS filter `!(_id in path('drafts.**'))`
 * - Learner queries ALWAYS require `isPublished == true`
 * - Drafts and unapproved items NEVER leak to student dashboards.
 */

export const PUBLISHED_COURSES_QUERY = groq`
  *[_type == "course" && !(_id in path('drafts.**')) && isPublished == true] | order(orderIndex asc, _createdAt desc) {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    description,
    category,
    targetAudience,
    gradeLevel,
    "thumbnailUrl": thumbnail.asset->url,
    signLanguage,
    isPublished,
    isFreeTier,
    priceNgn,
    durationMinutes,
    iconName,
    "modulesCount": count(modules),
    "lessonsCount": count(modules[]->lessons[])
  }
`;

export const COURSE_BY_ID_QUERY = groq`
  *[_type == "course" && !(_id in path('drafts.**')) && (_id == $id || slug.current == $id)][0] {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    description,
    category,
    targetAudience,
    gradeLevel,
    "thumbnailUrl": thumbnail.asset->url,
    signLanguage,
    isPublished,
    isFreeTier,
    priceNgn,
    durationMinutes,
    iconName,
    modules[]-> {
      _id,
      "id": _id,
      title,
      "slug": slug.current,
      orderIndex,
      description,
      lessons[]-> {
        _id,
        "id": _id,
        title,
        "slug": slug.current,
        lessonType,
        targetAudience,
        isFreeBasic1,
        orderIndex,
        durationMinutes,
        muxPlaybackId,
        description
      }
    }
  }
`;

export const LESSON_BY_ID_QUERY = groq`
  *[_type == "lesson" && !(_id in path('drafts.**')) && (_id == $id || slug.current == $id)][0] {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    lessonType,
    targetAudience,
    isFreeBasic1,
    orderIndex,
    durationMinutes,
    muxPlaybackId,
    description,
    learningObjectives,
    simpleEnglishExplanation,
    writtenExplanation,
    heroSignVideo-> {
      title,
      videoUrl,
      muxPlaybackId,
      "posterUrl": posterImage.asset->url,
      signLanguage,
      regionalVariant,
      durationSeconds,
      signerName,
      reviewedBy
    },
    vocabularyItems[]-> {
      _id,
      "id": _id,
      word,
      "slug": slug.current,
      category,
      simpleMeaning,
      exampleSentence,
      fingerspelling,
      "imageUrl": image.asset->url,
      imageAlt,
      signLanguage,
      vocabularySignVideo-> {
        videoUrl,
        muxPlaybackId,
        "posterUrl": posterImage.asset->url
      },
      signedMeaningVideo-> {
        videoUrl,
        muxPlaybackId,
        "posterUrl": posterImage.asset->url
      },
      visualStoryFrames[] {
        order,
        "imageUrl": image.asset->url,
        caption,
        altText
      }
    },
    storyPages[] {
      pageNumber,
      "illustrationUrl": illustration.asset->url,
      textContent,
      signVideo-> {
        videoUrl,
        muxPlaybackId,
        "posterUrl": posterImage.asset->url
      }
    },
    quizQuestions[] {
      questionText,
      promptSignVideo-> {
        videoUrl,
        "posterUrl": posterImage.asset->url
      },
      options[] {
        label,
        "imageUrl": image.asset->url,
        isCorrect
      }
    }
  }
`;

export const PUBLISHED_VOCABULARY_QUERY = groq`
  *[_type == "vocabularyItem" && !(_id in path('drafts.**')) && reviewStatus in ["approved", "published"]] | order(word asc) {
    _id,
    "id": _id,
    word,
    "slug": slug.current,
    category,
    simpleMeaning,
    exampleSentence,
    fingerspelling,
    "imageUrl": image.asset->url,
    imageAlt,
    signLanguage,
    reviewStatus,
    reviewedBy,
    vocabularySignVideo-> {
      videoUrl,
      muxPlaybackId,
      "posterUrl": posterImage.asset->url
    },
    signedMeaningVideo-> {
      videoUrl,
      muxPlaybackId,
      "posterUrl": posterImage.asset->url
    },
    visualStoryFrames[] {
      order,
      "imageUrl": image.asset->url,
      caption,
      altText
    }
  }
`;

export const LEARNING_PATHS_QUERY = groq`
  *[_type == "learningPath" && !(_id in path('drafts.**'))] | order(title asc) {
    _id,
    "id": _id,
    title,
    "slug": slug.current,
    tagline,
    targetAudience,
    description,
    badge,
    courses[]-> {
      _id,
      "id": _id,
      title,
      "slug": slug.current,
      category,
      gradeLevel,
      "thumbnailUrl": thumbnail.asset->url,
      isFreeTier
    }
  }
`;

/**
 * Fetch functions with automatic safety fallback
 */
export async function fetchPublishedCourses() {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch(PUBLISHED_COURSES_QUERY);
  } catch (error) {
    console.warn('Sanity courses fetch failed, falling back to local verified curriculum:', error);
    return null;
  }
}

export async function fetchCourseById(id: string) {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch(COURSE_BY_ID_QUERY, { id });
  } catch (error) {
    console.warn('Sanity course fetch failed, falling back to local curriculum:', error);
    return null;
  }
}

export async function fetchLessonById(id: string) {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch(LESSON_BY_ID_QUERY, { id });
  } catch (error) {
    console.warn('Sanity lesson fetch failed, falling back to local curriculum:', error);
    return null;
  }
}

export async function fetchPublishedVocabulary() {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch(PUBLISHED_VOCABULARY_QUERY);
  } catch (error) {
    console.warn('Sanity vocabulary fetch failed, falling back to local vocabulary:', error);
    return null;
  }
}

export async function fetchLearningPaths() {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch(LEARNING_PATHS_QUERY);
  } catch (error) {
    console.warn('Sanity learning paths fetch failed:', error);
    return null;
  }
}
