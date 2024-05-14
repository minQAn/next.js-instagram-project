import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getFollowingPostsOf } from '@/service/posts';

// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(){
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', { status: 401 }); // 그런 사용자가 없음
    }

    return getFollowingPostsOf(user.username)
        .then(data => NextResponse.json(data));
}