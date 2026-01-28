import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      //postId: string;
      commentId: string;
    }>;
  }
) {
  const { commentId } = await context.params;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        isApproved: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to approve comment' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      //postId: string;
      commentId: string;
    }>;
  }
) {
  const { commentId } = await context.params;

  try {

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment id is required' },
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}