import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

// page에서 뿐만아니라 api에서도 미들웨어가 동작하길 원함으로 작성
export async function middleware(req: NextRequest) {
    // console.log('******* middleware check...');

    const token = await getToken({ req });

    // 토큰이 없고 /api 요청이라면 바로 Authentication Error 반환
    if(!token) {
        if(req.nextUrl.pathname.startsWith('/api')) {
            return new NextResponse('Authentication Error', { status: 401 });
        }
        
        // /api 경로가 아니라 다른 페이지를 받는다면 이곳 실행
        // 현재 사용자가 어디로 가기를 원하는지 알아놓아야 함
        const { pathname, search, origin, basePath } = req.nextUrl;
        const signInUrl = new URL(`${basePath}/auth/signin`, origin);
        signInUrl.searchParams.append(
            'callbackUrl',
            `${basePath}${pathname}${search}`, // ?callBackUrl=뒤에 오는 url임
        );
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

// match에 경로를 설정하면 해당 경로는 무조건 미들웨어를 거처간다
// 참고 https://next-auth.js.org/configuration/nextjs 
// search나 users의 사용자 페이지는 로그인 하지 않아도 사용할 수 있음으로 제외
export const config = {
    matcher: [
        '/new', 
        '/',
        '/api/bookmarks',
        '/api/comments',
        '/api/likes',
        '/api/follow',
        '/api/me',
        '/api/posts/:path*',
    ],
}

