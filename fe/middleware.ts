import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedPaths = ["/library", "/checkout", "/dashboard", "/wishlist"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isProtected = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    )

    if (!isProtected) {
        return NextResponse.next()
    }

    // Check for auth token in cookies
    const token = request.cookies.get("token")?.value

    if (!token) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/library/:path*", "/checkout/:path*", "/dashboard/:path*", "/wishlist/:path*"],
}
