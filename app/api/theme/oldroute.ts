import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const theme = await prisma.theme.findFirst();

    if (!theme) {
      return NextResponse.json(
        { error: 'No theme found' },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Failed to fetch theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const theme = await prisma.theme.update({
      where: { id: 1 },
      data,
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}
