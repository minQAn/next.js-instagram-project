import { dislikePost, likePost } from '@/service/posts';
import { withSessionUser } from '@/util/session';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(req: NextRequest) {
    return withSessionUser(async (user) => {    
        // Request 요청 받는 데이터는 id & like 
        const {id, like} = await req.json();
        
        if(!id || like == null) {
            return new Response('Bad Request', {status: 400});
        }
        
        const request = like ? likePost : dislikePost;
        
        return request(id, user.id) //
        .then(res => NextResponse.json(res))
        .catch(error => new Response(JSON.stringify(error), {status: 500}));
    });
}