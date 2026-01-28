import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
        timestamp: new Date(),
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
