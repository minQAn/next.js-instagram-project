import { authOptions } from '@/app/lib/auth';
import { AuthUser } from '@/model/user';
import { getServerSession } from 'next-auth';

export async function withSessionUser(handler: (user: AuthUser) => Promise<Response>): Promise<Response> {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user) {
        return new Response('Authentication Error', {status: 401});        
    }

    // 사용자가 있다면
    return handler(user);
}