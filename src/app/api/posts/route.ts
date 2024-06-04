import { NextRequest, NextResponse } from 'next/server';
import { createPost, getFollowingPostsOf } from '@/service/posts';
import { withSessionUser } from '@/util/session';

// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(){
    return withSessionUser(async (user) =>  
        getFollowingPostsOf(user.username)
            .then(data => NextResponse.json(data))
    );
}

// to Create New Post
export async function POST(req: NextRequest){
    return withSessionUser(async (user) => {
        // body에 데이터를 정확하게 보내줬는지 체크
        const form = await req.formData();
        const text = form.get('text')?.toString();
        const file = form.get('file') as Blob;
        
        if(!text || file == null) {
            return new Response('Bad Request', {status: 400});
        }
        
        return createPost(user.id, text, file) //
            .then(data => NextResponse.json(data));
    });
}