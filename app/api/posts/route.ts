import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { Post, Comment } from '@/types';
import { cookies } from 'next/headers';

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
      date: post.date.toISOString(), // 👈 AQUI
      excerpt: post.excerpt,
      content: post.content,
      imageUrls: post.imageUrls,
      carrousel: post.carrousel,
      comments: post.comments.map(c => ({
        id: c.id,
        author: c.author,
        content: c.content,
        timestamp: c.timestamp.toISOString(),
        isApproved: c.isApproved,
      })),
    }))

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
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const role = cookieStore.get('role')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (role !== 'Admin') {
    return NextResponse.json({ user: null }, { status: 402 });
  }
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
      date: newPost.date,
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
