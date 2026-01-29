import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  // 🍪 Remove auth cookie
  response.cookies.delete('auth_token');
  response.cookies.delete('role');

  return response;
}