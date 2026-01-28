import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        isApproved: false,
      },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        author: c.author,
        content: c.content,
        isApproved: c.isApproved,
        timestamp: c.timestamp.toISOString(),

        // 👇 added
        postId: c.post.id,
        postTitle: c.post.title,
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
