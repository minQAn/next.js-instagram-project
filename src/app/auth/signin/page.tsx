import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignIn from '@/components/SignIn';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';
import { redirect } from 'next/navigation';

type Props = {
    searchParams: {
        callbackUrl: string; // 로그인 후 원래 있던 경로로 돌아가기 위함
    }
}

// Sever Component 
// searchParams: Next.js의 기능이며 callbackUrl은 NextAuth에서 정한 convention임
// https://medium.com/@sungbeenissungbeen/next-js-%ED%98%84%EC%9E%AC-%ED%8E%98%EC%9D%B4%EC%A7%80-url-search-params%EC%97%90-%EC%A0%91%EA%B7%BC%ED%95%98%EA%B8%B0-fc7514d75eb8
export default async function SignInPage({ searchParams: { callbackUrl }}: Props){
    const session = await getServerSession(authOptions);
    
    if(session) {
        redirect('/');
    }

    const providers = (await getProviders()) ?? {}; // becuase <Record> could be null

    return (
        <section className='flex justify-center mt-24'>
            {/* client side */}
            <SignIn providers={providers} callbackUrl={callbackUrl ?? '/'} /> 
        </section>
    )
}