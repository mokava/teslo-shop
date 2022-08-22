import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

export async function middleware(req: NextRequest) {
	// console.log({ req });
	if (
		req.nextUrl.pathname.startsWith('/checkout/address') ||
		req.nextUrl.pathname.startsWith('/checkout/summary')
	) {
		const session = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
		});
		// const { origin } = req.nextUrl;
		// console.log({ session });
		if (!session) {
			// const requestedPage = req.nextUrl.pathname;
			// const url = req.nextUrl.clone();
			// url.pathname = `/auth/login`;
			// url.search = `p=${requestedPage}`;
			// return NextResponse.redirect(url);
			// const requestedPage = req.page.name;
			const { origin } = req.nextUrl.clone();
			const requestedPage = req.nextUrl.pathname;
			return NextResponse.redirect(`${origin}/auth/login?p=${requestedPage}`);
		}

		return NextResponse.next();
	}

	if (req.nextUrl.pathname.startsWith('/admin')) {
		const cookie = req.headers.get('cookie');
		const session: any = await getSession({
			req: { headers: { cookie } } as any,
		});
		const url = req.nextUrl.clone();

		if (!session) {
			const { origin } = req.nextUrl.clone();
			const requestedPage = req.nextUrl.pathname;
			return NextResponse.redirect(
				`${url.origin}/auth/login?p=${requestedPage}`
			);
		}

		const validRoles = ['admin', 'super-user', 'SEO'];

		if (!validRoles.includes(session.user.role)) {
			return NextResponse.redirect(url.origin);
		}

		return NextResponse.next();
	}
}

export const config = {
	matcher: ['/checkout/:path*'],
};
