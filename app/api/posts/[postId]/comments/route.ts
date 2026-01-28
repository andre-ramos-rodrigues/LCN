import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

type Params = {
  params: Promise<{
    postId: string;
  }>;
};

/* ===================== POST ===================== */
export async function POST(request: Request, context: Params) {
  try {
    const { content, author } = await request.json();
    const { postId } = await context.params;

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

    return NextResponse.json({
      ...comment,
      timestamp: comment.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

/* ===================== GET ===================== */
export async function GET(request: Request, context: Params) {
  try {
    /*const { postId } = await context.params;
    const { searchParams } = new URL(request.url);

    const approvedParam = searchParams.get('approved');
    const isApproved =
      approvedParam === null ? undefined : approvedParam === 'true';*/

    const comments = await prisma.comment.findMany({
      /*where: {
        postId,
        ...(isApproved !== undefined && { isApproved }),
        isApproved: false,
      },*/
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        author: c.author,
        content: c.content,
        isApproved: c.isApproved,
        timestamp: c.timestamp.toISOString(),
      }))
    );
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/* ===================== PATCH (MODERATION) ===================== */
export async function PATCH(request: Request) {
  try {
    const body: {
      commentId: string;
      isApproved?: boolean;
      content?: string;
    } = await request.json();

    const { commentId, isApproved, content } = body;

    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required' },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        ...(isApproved !== undefined && { isApproved }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json({
      id: updatedComment.id,
      author: updatedComment.author,
      content: updatedComment.content,
      isApproved: updatedComment.isApproved,
      timestamp: updatedComment.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body: {
      commentId: string;
    } = await request.json();

    const { commentId} = body;

    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required' },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      id: updatedComment.id,
      author: updatedComment.author,
      content: updatedComment.content,
      isApproved: updatedComment.isApproved,
      timestamp: updatedComment.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}
