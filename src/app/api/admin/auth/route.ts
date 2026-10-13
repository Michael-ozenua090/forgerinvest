import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'forge_admin_session';

export async function POST(req: NextRequest) {
  try {
    const { adminKeyName, adminPassword } = await req.json();

    const expectedKey = process.env.ADMIN_KEY_NAME || 'forge_super_admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'your_secure_admin_password_here';

    if (
      !adminKeyName ||
      !adminPassword ||
      adminKeyName.trim() !== expectedKey.trim() ||
      adminPassword.trim() !== expectedPass.trim()
    ) {
      return NextResponse.json(
        { error: 'Invalid admin key identifier or security password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authorization successful.',
    });

    // Set secure HTTP-only cookie valid for 24 hours
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Malformed authentication request.' },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME);

  if (sessionCookie && sessionCookie.value === 'true') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json(
    { authenticated: false, error: 'Unauthorized admin access.' },
    { status: 401 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin session terminated.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
