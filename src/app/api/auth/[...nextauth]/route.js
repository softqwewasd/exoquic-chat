import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:org read:user user:email'
        }
      }
    }),
  ],
	callbacks: {
    async jwt({ token, account, profile }) {
			// Persist the access token and profile info right after signin
			if (account && profile) {
				console.log("THIS IS THE TOKEN:", token);
				return { ...token, accessToken: account.access_token, login: profile.login };
			}
			return token;
    },
    async session({ session, token }) {
			// Send properties to the client
			session.accessToken = token.accessToken;
			session.user.login = token.login;
			console.log("THIS IS THE SESSION:", session);
			return { ...session, accessToken: token.accessToken };
		},
	},
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 
