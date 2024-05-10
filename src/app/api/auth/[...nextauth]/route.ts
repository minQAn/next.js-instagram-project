import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// https://console.cloud.google.com/

const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_ID || '',
            clientSecret: process.env.GOOGLE_OAUTH_SECRET || '',
    }),
    // ...add more providers here
    ],
    callbacks: {     
        async session({ session }) {
            console.log(session);
            const user = session?.user;
            if(user) {
                session.user = {
                    ...user,
                    username: user.email?.split('@')[0] || '' // 1. username의 타입은 별도로 수정: /types/next-auth.d.ts에서 함 2. email의 @ 앞부분을 username으로 할당
                }
            }
        return session;
      },  
    },
    // to make custome login page -> https://next-auth.js.org/configuration/pages
    pages: {
        signIn: '/auth/signin',
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }