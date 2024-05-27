import { authOptions } from '@/app/lib/auth';
import { dislikePost, likePost } from '@/service/posts';
import { follow, unfollow } from '@/service/user';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', {status: 401});        
    }

    // Request 요청 받는 데이터는 id & like 
    const {id: targetId, follow: isFollow} = await req.json();

    if(!targetId || isFollow === undefined) {
        return new Response('Bad Request', {status: 400});
    }

    const request = isFollow ? follow : unfollow;

    return request(user.id, targetId) //
        .then(res => NextResponse.json(res))
        .catch(error => new Response(JSON.stringify(error), {status: 500}));
}