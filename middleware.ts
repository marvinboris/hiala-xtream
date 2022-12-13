import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { verify } from './lib/jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.headers.get('x-auth-token'); // Will output `referer` header value

    const response = NextResponse.next();
    
    // Validate token
    if (!token) return response

    try {
        const decoded = await verify(token, process.env.JWT_SECRET!)
        response.cookies.set('user', decoded.user)

        return response
    } catch (error) {
        return response
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/:path*',
}