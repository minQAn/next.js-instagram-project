import UserSearch from '@/components/UserSearch';
import { Metadata } from 'next';

// 서버사이드 렌더링으로 만들기 위함
export const dynamic = 'force-dynamic';

// Metadata
export const metadata: Metadata = {
    title: 'User Search',
    description: 'Search users to follow',
}

export default function SearchPage(){
    return <UserSearch />
}