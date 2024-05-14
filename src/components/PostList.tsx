'use client';

import { SimplePost } from '@/model/post';
import useSWR from 'swr';

export default function PostList(){
    const { data: posts, isLoading, error } = useSWR<SimplePost[]>('/api/posts');
    console.log(posts);
    return <ul>
        {posts && posts.map(post => <li key={post.id}>
            {post.text}
        </li>)}
    </ul>;
}