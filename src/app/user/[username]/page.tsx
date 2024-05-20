import UserPosts from '@/components/UserPosts';
import UserProfile from '@/components/UserProfile';
import { getUserForProfile } from '@/service/user';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

// Metadata에서 getUserForProfile 함수가 여러번 반복됨으로 cache 사용
const getUser = cache(async (username: string) => getUserForProfile(username));

type Props = {
    params: {username: string};
}

export default async function UserPage({ params: {username}}: Props){
    // 상단: 사용자의 프로필 이미지와 정보(username, name, following, followers 숫자 정보)
    // 하단: 3개의 탭 (posts, liked, bookmarks)
    const user = await getUser(username); // useSWR는 클라이언트 컴포넌트에서만 사용 | cache

    if(!user) {
        notFound();
    }
    return (
        <section className='w-full'>
            <UserProfile user={user} />
            <UserPosts user={user} />
        </section>
    );
}


// For Metadata Params. 이름은 nextjs에서 정한 함수명 
export async function generateMetadata({ params: {username}}: Props): Promise<Metadata> {
    const user = await getUser(username); // cache
    return {
        title: `${user?.name} (@${user?.username}) · Instagram Photos`,
        description: `${user?.name}'s all Instagram posts`,
    }
}