import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { cookies } from 'next/headers';

/*
type Params = {
  params: { id: string };
};*/

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
const { id } = await params;
  const social = await prisma.socialLink.findUnique({
    where: { id: Number(id) },
  });

  if (!social) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(social);
}

export async function PUT(req: Request, { params }: Params) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const role = cookieStore.get('role')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (role !== 'Admin') {
    return NextResponse.json({ user: null }, { status: 402 });
  }

  const { id } = await params;
  const data = await req.json();

  const updated = await prisma.socialLink.update({
     where: { id: Number(id) },
    data: {
      title: data.title,
      link: data.link,
      logo: data.logo,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
    const { id } = await params;
  await prisma.socialLink.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
