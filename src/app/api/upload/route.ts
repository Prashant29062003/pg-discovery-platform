import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  optimizePGThumbnail,
  optimizePGHero,
  optimizeRoomImage,
  optimizeSquareProfile,
  optimizeGalleryImage,
  validateImageFile,
} from '@/lib/image-utils';
import { CLOUDINARY_CONFIG, isCloudinaryConfigured, DEFAULT_IMAGES } from '@/lib/cloudinary';

/**
 * POST /api/upload
 * Upload and optimize images to Cloudinary
 * Uses compression backend before uploading to cloud
 * 
 * Query params:
 * - imageType: 'pgThumbnail' | 'pgHero' | 'roomImage' | 'squareProfile' | 'galleryImage'
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check - only authenticated users can upload
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { 
          error: 'Cloudinary is not configured. Please set environment variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
          fallbackUrl: DEFAULT_IMAGES.pgThumbnail
        },
        { status: 503 }
      );
    }

    // Get image type from query
    let imageType = request.nextUrl.searchParams.get('imageType') as
      | 'pgThumbnail'
      | 'pgHero'
      | 'roomImage'
      | 'squareProfile'
      | 'galleryImage' | 'pgGallery';

    // Map pgGallery to galleryImage
    if (imageType === 'pgGallery') {
      imageType = 'galleryImage';
    }

    if (!imageType || !['pgThumbnail', 'pgHero', 'roomImage', 'squareProfile', 'galleryImage'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid or missing image type. Use: pgThumbnail, pgHero, roomImage, squareProfile, galleryImage' },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize based on type
    let optimized: Buffer;
    switch (imageType) {
      case 'pgThumbnail':
        optimized = await optimizePGThumbnail(buffer);
        break;
      case 'pgHero':
        optimized = await optimizePGHero(buffer);
        break;
      case 'roomImage':
        optimized = await optimizeRoomImage(buffer);
        break;
      case 'squareProfile':
        optimized = await optimizeSquareProfile(buffer);
        break;
      case 'galleryImage':
        optimized = await optimizeGalleryImage(buffer);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown image type' },
          { status: 400 }
        );
    }

    // Upload to Cloudinary
    try {

      const cloudinaryFormData = new FormData();
      // Convert Buffer to Uint8Array for FormData compatibility
      cloudinaryFormData.append('file', new Blob([new Uint8Array(optimized)]), file.name);
      cloudinaryFormData.append('upload_preset', 'pg_images');
      cloudinaryFormData.append('folder', 'pg-discovery-platform');
      cloudinaryFormData.append('resource_type', 'auto');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

      const cloudinaryResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      console.log('[Upload] Cloudinary response status:', cloudinaryResponse.status);

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        console.error('[Upload] Cloudinary error response:', errorData);
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();

      return NextResponse.json(
        {
          success: true,
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          filename: file.name,
          imageType: imageType,
        },
        { status: 201 }
      );
    } catch (cloudinaryErr) {
      console.error('[Upload] Cloudinary upload error:', cloudinaryErr);
      return NextResponse.json(
        {
          error: 'Failed to upload to Cloudinary',
          details: cloudinaryErr instanceof Error ? cloudinaryErr.message : 'Unknown error',
          fallbackUrl: DEFAULT_IMAGES.pgThumbnail,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
