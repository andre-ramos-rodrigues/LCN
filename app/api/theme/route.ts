import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
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
    const data = await request.json();

    const updatedTheme = await prisma.theme.upsert({
      where: { id: 1 },
      update: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        base100Color: data.base100Color,
        textPrimaryColor: data.textPrimaryColor,
        textSecondaryColor: data.textSecondaryColor,
        headerText: data.headerText,
        footerText: data.footerText,
      },
      create: {
        id: 1,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        base100Color: data.base100Color,
        textPrimaryColor: data.textPrimaryColor,
        textSecondaryColor: data.textSecondaryColor,
        headerText: data.headerText,
        footerText: data.footerText,
      },
    });

    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const theme = await prisma.theme.findUnique({
      where: { id: 1 },
    });

    if (!theme) {
      return NextResponse.json({}, { status: 200 });
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
