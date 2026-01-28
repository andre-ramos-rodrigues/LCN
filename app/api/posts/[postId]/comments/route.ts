import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      postId: string;
    }>;
  }
) {
  try {
    const { content, author } = await request.json();

    const { postId } = await context.params;
    //const postId = params.postId;

    const comment = await prisma.comment.create({
      data: {
        author,
        content,
        timestamp: new Date(),
        isApproved: false,
        post: {
          connect: { id: postId },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
