import { addBookmark, removeBookmark } from '@/service/user';
import { withSessionUser } from '@/util/session';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {

    // user가 로그인한 경우에만 처리
    // same as return withSessionuser(callback); // callback == (user) => Promise<Response>
    return withSessionUser(async (user) => {
        // Request 요청 받는 데이터는 id & like 
        const { id, bookmark } = await req.json();

        if(!id || bookmark == null) { // null이거나 undefined경우에는 이렇게 유효성 검사를 해야함
            return new Response('Bad Request', {status: 400});
        }

        const request = bookmark ? addBookmark : removeBookmark;

        return request(user.id, id) // userId, postId
            .then(res => NextResponse.json(res))
            .catch(error => new Response(JSON.stringify(error), {status: 500}));
    })

    
}