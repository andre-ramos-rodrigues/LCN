import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function PUT(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {

    const { postId } = await context.params;

    console.log('Updating post with ID:', postId);

    // ✅ Safely parse JSON
    const {
      title,
      author,
      excerpt,
      content,
      imageUrls,
    } = await request.json();

    console.log('Update data received:', {
      title,
      author})

    const updatedPost = await prisma.post.update({
      where: { id: postId }, 
      data: {
        title,
        author,
        excerpt,
        content,
        imageUrls,
      },
      include: {
        comments: {
          where: { isApproved: true },
        },
      },
    });

    return NextResponse.json({
      id: updatedPost.id,
      title: updatedPost.title,
      author: updatedPost.author,
      date: updatedPost.date.toISOString(),
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      imageUrls: updatedPost.imageUrls,
      comments: updatedPost.comments.map(c => ({
        id: c.id,
        author: c.author,
        content: c.content,
        timestamp: c.timestamp.toISOString(),
        isApproved: c.isApproved,
      })),
    });
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
     const { postId } = await context.params;
    // Optional: check if post exists first
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { success: true, id: postId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    console.log('Patching post with ID:', postId);

    if (!postId) {
      return NextResponse.json(
        { error: 'Missing post id' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Patch data received:', body);

    // Verify post exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // ✅ PATCH-safe dynamic data object
    const data: Record<string, any> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.author !== undefined) data.author = body.author;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.content !== undefined) data.content = body.content;
    if (body.imageUrls !== undefined) data.imageUrls = body.imageUrls;
    if (body.carrousel !== undefined) data.carrousel = body.carrousel;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data,
      include: {
        comments: {
          where: { isApproved: true },
        },
      },
    });

    return NextResponse.json({
      id: updatedPost.id,
      title: updatedPost.title,
      author: updatedPost.author,
      date: updatedPost.date.toISOString(),
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      imageUrls: updatedPost.imageUrls,
      carrousel: updatedPost.carrousel,
      comments: updatedPost.comments.map(c => ({
        id: c.id,
        author: c.author,
        content: c.content,
        timestamp: c.timestamp.toISOString(),
        isApproved: c.isApproved,
      })),
    });
  } catch (error) {
    console.error('Failed to patch post:', error);
    return NextResponse.json(
      { error: 'Failed to patch post' },
      { status: 500 }
    );
  }
}
