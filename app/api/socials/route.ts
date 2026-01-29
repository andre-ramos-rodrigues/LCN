import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { cookies } from 'next/headers';

// GET — list socials
export async function GET() {
  try {
    const socials = await prisma.socialLink.findMany({
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(socials)
  } catch (error) {
    console.error('Failed to fetch socials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch socials' },
      { status: 500 }
    )
  }
}
// POST — create
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

  const data = await request.json();

  const social = await prisma.socialLink.create({
    data: {
      title: data.title,
      link: data.link,
      logo: data.logo,
      order: data.order ?? 0,
    },
  });

  return NextResponse.json(social);
}
