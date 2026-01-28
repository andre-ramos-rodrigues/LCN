import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      postId: string;
      commentId: string;
    }>;
  }
) {
  const { postId, commentId } = await context.params;

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
