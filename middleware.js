import { NextResponse } from 'next/server'
import { decodeToken } from './lib/utils'

export async function middleware(req, ev) {
    try {
        const token = req ? req.cookies.get('token') : null
        const { pathname } = req.nextUrl
        const decodedToken = await decodeToken(token)
        if ((token && decodedToken.issuer) || pathname.includes('api/login')) {
            return NextResponse.next()
        } else if (!token && pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    } catch (error) {}
}

export const config = {
    matcher: '/',
}
