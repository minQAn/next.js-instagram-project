import { addUser } from '@/service/user';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'

// https://console.cloud.google.com/
// Next.js에서는 route.ts 파일에서 임의의 객체를 내보내는 것이 허용되지 않습니다.
// GET, POST, PATCH 등과 같은 이름이 지정된 객체만 내보낼 수 있습니다.
// authOptions와 같은 임의의 객체를 내보내려고 하니 빌드가 실패하게 된 것입니다.

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_ID || '',
            clientSecret: process.env.GOOGLE_OAUTH_SECRET || '',
    }),
    // ...add more providers here
    ],
    callbacks: {     
        // 참고: https://www.sanity.io/docs/js-client#creating-if-not-already-present
        async signIn({ user: {id, name, email, image} }) {
            // console.log('* user: ', user);
            
            // email이 없으면 잘못된 정보이므로
            if(!email) {
                return false;
            }
            // key: username 추가해서 가공
            addUser({id, name: name || '', email, image, username: email.split('@')[0] || ''}); 

            return true;
        },
        async session({ session }) {
            // console.log('* session:', session);
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