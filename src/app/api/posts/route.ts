import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { createPost, getFollowingPostsOf } from '@/service/posts';

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

// to Create New Post
export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', { status: 401 }); // 그런 사용자가 없음
    }

    // body에 데이터를 정확하게 보내줬는지 체크
    const form = await req.formData();
    const text = form.get('text')?.toString();
    const file = form.get('file') as Blob;

    if(!text || file === undefined) {
        return new Response('Bad Request', {status: 400});
    }

    return createPost(user.id, text, file) //
        .then(data => NextResponse.json(data));
}