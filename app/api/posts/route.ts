import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          where: { isApproved: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      author: post.author,
      date: post.date.toISOString(),
      excerpt: post.excerpt,
      content: post.content,
      imageUrls: post.imageUrls,
      carrousel: post.carrousel,
      comments: post.comments.map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        timestamp: comment.timestamp.toISOString(),
        isApproved: comment.isApproved,
      })),
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, author, excerpt, content, imageUrls } = await request.json();

    if (!title || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        author,
        excerpt,
        content,
        imageUrls,
        date: new Date(),
        //timestamp: new Date(),
      },
      include: {
        comments: {
          where: { isApproved: true },
        },
      },
    });

    const transformedPost = {
      id: newPost.id,
      title: newPost.title,
      author: newPost.author,
      date: newPost.date.toISOString(),
      excerpt: newPost.excerpt,
      content: newPost.content,
      imageUrls: newPost.imageUrls,
      comments: [],
    };

    return NextResponse.json(transformedPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
