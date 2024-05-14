'use client';

import { SimplePost } from '@/model/post';
import { PuffLoader } from 'react-spinners';
import useSWR from 'swr';
import PostListCard from './PostListCard';

// Next의 Image는 로컬에 있는 이미지를 가져올 때 최적화해서 좋지만 외부 이미지 url을 가져올 때는 어려움.
// 그래서 외부 이미지url을 가져올 때 @sanity/image-url 을 사용하면 최적화 가능
// https://www.sanity.io/docs/image-url
export default function PostList(){
    const { data: posts, isLoading, error } = useSWR<SimplePost[]>('/api/posts');
    console.log(posts);
    return <section>
        {isLoading && (
            <div>
                <PuffLoader color='cyan' />
            </div>
        )}
        {posts && (
            <ul>
                {posts && posts.map(post => (
                    <li key={post.id}>
                        <PostListCard post={post} />
                    </li>)
                )}
            </ul>
        )}
    </section>;
}