import { searchUsers } from '@/service/user';
import { NextResponse } from 'next/server';

// Nextjs에서 제공하는 fetch를 사용하여 cache control을 하지 않는 이상, SSG로 행동을 한다

export const dynamic = 'force-dynamic';

export async function GET() {
    return searchUsers().then((data) => NextResponse.json(data));
}