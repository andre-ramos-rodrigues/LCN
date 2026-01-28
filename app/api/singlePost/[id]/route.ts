import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
){
console.log('singlePost route called');
  const { id } = await context.params; // ✅ THIS IS THE FIX

  try {
    //const body = await req.json();
    //const { id } = body;
    console.log('Fetching post with id:', id);
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        comments: {
          where: { isApproved: true },
         /* orderBy: { date: 'desc' },*/
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}
