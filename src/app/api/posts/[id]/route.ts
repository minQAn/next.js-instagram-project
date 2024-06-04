import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/service/posts';
import { withSessionUser } from '@/util/session';

type Context = {
    params: {id: string};
}

// GROQ 사용 https://www.sanity.io/docs/groq
export async function GET(_: NextRequest, context: Context){
    return withSessionUser(async () =>  
        getPost(context.params.id) //
            .then(data => NextResponse.json(data))
    );
}