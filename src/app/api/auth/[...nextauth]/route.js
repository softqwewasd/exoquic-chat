import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:org user'
        }
      }
    }),
  ],
	callbacks: {
    async jwt({ token, account }) {
			// Persist the access token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
    },
    async session({ session, token }) {
			// Send properties to the client
			session.accessToken = token.accessToken;
			return session;
		},
	},
});

export { handler as GET, handler as POST } 