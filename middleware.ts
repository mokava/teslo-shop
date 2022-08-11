import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	console.log({ req });
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
}

export const config = {
	matcher: ['/checkout/:path*'],
};
