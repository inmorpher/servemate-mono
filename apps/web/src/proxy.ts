import { IronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';
import { getSession, ISessionData } from './app/lib/session';

export default async function Proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const publicRoutes = ['/login', '/refresh'];

	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	const session = await getSession();

	if (!session || !session.isLoggedIn) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);
		return NextResponse.redirect(loginUrl);
	}
	if (isAccessTokenExpired(session)) {
		const refreshUrl = new URL('/refresh', request.url);
		refreshUrl.searchParams.set('returnUrl', pathname + request.nextUrl.search);
		return NextResponse.redirect(refreshUrl);
	}

	if (pathname === '/') {
		return NextResponse.redirect(new URL('/cpanel', request.url));
	}
	return NextResponse.next();
}

function isAccessTokenExpired(session: IronSession<ISessionData>): boolean {
	if (session.expiresAt === undefined) return true;
	return Date.now() >= session.expiresAt;
}

export const config = {
	matcher: [
		'/(protected)/:path*',
		'/((?!_next/static|_next/image|favicon.ico|api|refresh|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|font|ttf|woff|woff2)).*)',
	],
};
