import { addComment } from '@/service/posts';
import { withSessionUser } from '@/util/session';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    return withSessionUser(async (user) => {
        // Request 요청 받는 데이터는 id & like 
        const { id, comment } = await req.json();

        if(!id || comment == null) {
            return new Response('Bad Request', {status: 400});
        }

        return addComment(id, user.id, comment) //
            .then(res => NextResponse.json(res))
            .catch(error => new Response(JSON.stringify(error), {status: 500}));
    });
}