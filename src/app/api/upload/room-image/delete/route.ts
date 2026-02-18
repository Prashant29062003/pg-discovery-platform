import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Image URL is required' },
        { status: 400 }
      );
    }

    // NOTE: For room edit forms, we don't update the database immediately
    // The form will handle database updates when submitted
    // This prevents form state from resetting during delete

    // Try to delete the file from disk
    try {
      const filePath = process.cwd() + '/public' + imageUrl;
      await unlink(filePath);
    } catch (fileError) {
      // File might not exist, continue
      console.warn('File not found for deletion:', imageUrl);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
