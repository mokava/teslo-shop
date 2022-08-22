import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { db, dbUsers } from '../../../database';
import { User } from '../../../models';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		Credentials({
			name: 'Custom Login',
			credentials: {
				email: {
					label: 'Correo:',
					type: 'email',
					placeholder: 'correo@google.com',
				},
				password: {
					label: 'Contraseña:',
					type: 'password',
					placeholder: 'Contraseña',
				},
			},
			async authorize(credentials) {
				// return { name: 'Juan', correo: 'juan@gmail.com', role: 'admin' };
				return await dbUsers.checkUserEmailPassword(
					credentials!.email,
					credentials!.password
				);
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		// ...add more providers here
	],
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register',
	},
	session: {
		maxAge: 2592000, //30d
		strategy: 'jwt',
		updateAge: 86400, //cada día
	},
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;

				switch (account.type) {
					case 'oauth':
						token.user = await dbUsers.oAuthToDbUser(
							user?.email || '',
							user?.name || ''
						);

					case 'credentials':
						token.user = user;
						break;
				}
			}

			// console.log({ token, account, user });

			return token;
		},
		async session({ session, token, user }) {
			session.accessToken = token.accessToken;
			session.user = token.user as any;

			// console.log({ session, token, user });
			return session;
		},
	},
});
