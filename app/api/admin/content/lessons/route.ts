import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/sanity/env';
import { getLessonById, updateLessonInMemory } from '@/lib/api';
import { MOCK_LESSONS } from '@/lib/mock-data';

/**
 * DeafLMS — Admin Content Management API
 * 
 * Uses Sanity API for easy GUI management directly from the DeafLMS Admin Dashboard.
 * Eliminates the need to open a separate external studio application.
 * 
 * - GET: Retrieves lesson details from Sanity or active curriculum.
 * - POST: Mutates lesson documents in Sanity and updates live runtime state.
 */

// Helper to extract clean Mux playback ID from bare IDs or player URLs
function extractMuxId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/(?:player|stream)\.mux\.com\/([a-zA-Z0-9]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed.split('?')[0].replace(/[^a-zA-Z0-9_-]/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // 1. Try querying Sanity directly if configured
    const readClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    });

    try {
      const sanityLessons = await readClient.fetch(
        `*[_type == "lesson" && !(_id in path('drafts.**'))] | order(orderIndex asc) {
          _id,
          "id": _id,
          title,
          "slug": slug.current,
          description,
          muxPlaybackId,
          isFreeBasic1,
          orderIndex,
          durationMinutes,
          targetAudience,
          lessonType
        }`
      );

      if (sanityLessons && sanityLessons.length > 0) {
        const filtered = courseId
          ? sanityLessons.filter((l: any) => l.courseId === courseId || l.id.includes(courseId))
          : sanityLessons;
        if (filtered.length > 0) {
          return NextResponse.json({ source: 'sanity_api', lessons: filtered });
        }
      }
    } catch (sanityErr) {
      console.warn('Sanity read query notice, returning active curriculum:', sanityErr);
    }

    // 2. Return active verified lessons catalog
    const allMockLessons = Object.values(MOCK_LESSONS);
    const filtered = courseId
      ? allMockLessons.filter((l) => l.courseId === courseId)
      : allMockLessons;

    return NextResponse.json({ source: 'active_curriculum', lessons: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const roleCookie = request.cookies.get('deaflms_role')?.value;
    if (roleCookie !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Platform administrator credentials required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      courseId = 'course-frontend-web-1',
      title,
      description,
      muxPlaybackId,
      isFreeBasic1,
      orderIndex,
      durationMinutes,
    } = body;

    if (!id || !title) {
      return NextResponse.json(
        { error: 'Lesson ID and Title are required.' },
        { status: 400 }
      );
    }

    const cleanedMuxId = extractMuxId(muxPlaybackId || '');

    // 1. Update in-memory / active dataset in DeafLMS immediately so students see changes in real time
    const updatedLesson = updateLessonInMemory({
      id,
      courseId,
      title,
      description,
      muxPlaybackId: cleanedMuxId,
      isFreeBasic1: Boolean(isFreeBasic1),
      orderIndex: Number(orderIndex) || 1,
      durationMinutes: Number(durationMinutes) || 10,
    });

    let persistedToSanity = false;
    let sanityMessage = 'Updated in active DeafLMS platform';

    // 2. If Sanity Write Token is provided, persist mutation directly to Sanity Content Lake!
    const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

    if (writeToken) {
      try {
        const writeClient = createClient({
          projectId,
          dataset,
          apiVersion,
          token: writeToken,
          useCdn: false,
        });

        // Use createOrReplace to ensure document exists with proper schema
        await writeClient.createOrReplace({
          _id: id,
          _type: 'lesson',
          title,
          slug: { _type: 'slug', current: id },
          description: description || '',
          muxPlaybackId: cleanedMuxId,
          isFreeBasic1: Boolean(isFreeBasic1),
          orderIndex: Number(orderIndex) || 1,
          durationMinutes: Number(durationMinutes) || 10,
          targetAudience: 'deaf_adult',
          lessonType: 'standard_lesson',
        });

        persistedToSanity = true;
        sanityMessage = 'Successfully synced to Sanity Cloud Content Lake (Project u7ai9rb7)';
      } catch (sanityErr: any) {
        console.error('Sanity write error:', sanityErr);
        sanityMessage = `Local update succeeded, but Sanity write failed: ${sanityErr.message}`;
      }
    } else {
      sanityMessage = 'Saved to active DeafLMS platform. (To persist to Sanity Cloud, add SANITY_API_WRITE_TOKEN in .env.local)';
    }

    return NextResponse.json({
      success: true,
      persistedToSanity,
      message: sanityMessage,
      lesson: updatedLesson,
    });
  } catch (err: any) {
    console.error('Error updating lesson:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error updating lesson' },
      { status: 500 }
    );
  }
}
