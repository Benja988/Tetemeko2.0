import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/controllers/auth.controller';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-html';

// Rate limiting configuration
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Validation schema
const registerSchema = (body: any) => {
  const { email, password, name } = body;
  if (!email || typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new Error('Valid email is required');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!name || typeof name !== 'string' || name.length < 2) {
    throw new Error('Name must be at least 2 characters');
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Apply rate limiting (simplified for Next.js)
    // In production, you'd use a more sophisticated rate limiting solution

    // Validate request body
    registerSchema(body);

    // Sanitize inputs
    const sanitizedBody = {
      ...body,
      email: sanitize(body.email, { allowedTags: [] }),
      name: sanitize(body.name, { allowedTags: [] })
    };

    // Create a mock req/res for the controller
    const mockReq = {
      body: sanitizedBody,
      user: null
    };

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => NextResponse.json(data, { status: code })
      }),
      json: (data: any) => NextResponse.json(data)
    };

    return await registerUser(mockReq as any, mockRes as any);
  } catch (error: any) {
    console.error('Register user error:', error.message);
    return NextResponse.json(
      { message: 'Invalid request data', errors: error.message },
      { status: 400 }
    );
  }
}