import { authOptions } from '@/app/lib/auth';
import { addComment } from '@/service/posts';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', {status: 401});        
    }

    // Request 요청 받는 데이터는 id & like 
    const { id, comment } = await req.json();

    if(!id || comment === undefined) {
        return new Response('Bad Request', {status: 400});
    }

    return addComment(id, user.id, comment) //
        .then(res => NextResponse.json(res))
        .catch(error => new Response(JSON.stringify(error), {status: 500}));
}