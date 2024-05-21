import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { getPost } from '@/service/posts';


type Context = {
    params: {id: string};
}

// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(request: NextRequest, context: Context){
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', { status: 401 }); // 그런 사용자가 없음
    }
    
    return getPost(context.params.id) //
        .then(data => NextResponse.json(data));
}