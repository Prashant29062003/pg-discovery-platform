import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const roomId = formData.get('roomId') as string;
    const pgId = formData.get('pgId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!roomId || !pgId) {
      return NextResponse.json(
        { success: false, message: 'Room ID and PG ID are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'rooms', pgId, roomId);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, continue
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/rooms/${pgId}/${roomId}/${uniqueFileName}`;

    // NOTE: For room edit forms, we don't update the database immediately
    // The form will handle database updates when submitted
    // This prevents form state from resetting during upload

    // Here you would typically also update the database
    // For now, we'll just return the file information
    const imageInfo = {
      id: randomUUID(),
      url: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      roomId,
      pgId,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: imageInfo,
      message: 'Image uploaded successfully',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
