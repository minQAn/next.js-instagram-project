import { searchUsers } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
    params: { keyword: string };
}
export async function GET(req: NextRequest, context: Context) {
    // nextUrl: https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl
    const keyword = req.nextUrl.searchParams.get('keyword');

    return searchUsers(keyword) //
        .then(data => NextResponse.json(data));
}