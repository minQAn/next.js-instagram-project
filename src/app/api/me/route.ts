import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/service/user';
import { withSessionUser } from '@/util/session';

// 현재 로그인한 사용자의 정보
// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(){
    return withSessionUser(async (user) =>        
        getUserByUsername(user.username)
            .then(data => NextResponse.json(data))
    );
}