import { User } from '@/model/user';
// import { DefaultSession } from 'next-auth';

// username이란건 없어서 타입을 추가로 줌
declare module 'next-auth' {
    interface Session {
        user: User;

        // user: {
        //     username: string;            
        // } & DefaultSession['user']; // 기존 DefaultSession의 user를 그대로 가져가면서 username을 추가
    }
}