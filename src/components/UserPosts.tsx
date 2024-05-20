'use client';

import { ProfileUser } from '@/model/user';
import { useState } from 'react';
import useSWR from 'swr';

type Props = {
    user: ProfileUser;
}

type Tab = 'posts' | 'liked' | 'saved';

export default function UserPosts({ user: { username }}: Props){
    // /api/users/${username}/posts
    // /api/users/${username}/liked 
    // /api/users/${username}/bookmarks

    const [tab, setTab] = useState<Tab>('liked');
    const {data: posts, isLoading, error} = useSWR(`/api/users/${username}/${tab}`);
    console.log(posts);
    return <>
    </>;
}