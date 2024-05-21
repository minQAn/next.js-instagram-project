import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { getUserByUsername } from '@/service/user';

// 현재 로그인한 사용자의 정보
// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(){
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', { status: 401 }); // 그런 사용자가 없음
    }

    return getUserByUsername(user.username)
        .then(data => NextResponse.json(data));
}