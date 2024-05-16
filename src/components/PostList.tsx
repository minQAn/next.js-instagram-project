'use client';

import { SimplePost } from '@/model/post';
import { PuffLoader } from 'react-spinners';
import useSWR from 'swr';
import PostListCard from './PostListCard';
import PuffSpinner from './ui/PuffSpinner';

// Next의 Image는 로컬에 있는 이미지를 가져올 때 최적화해서 좋지만 외부 이미지 url을 가져올 때는 어려움.
// 그래서 외부 이미지url을 가져올 때 @sanity/image-url 을 사용하면 최적화 가능
// https://www.sanity.io/docs/image-url
export default function PostList(){
    const { data: posts, isLoading, error } = useSWR<SimplePost[]>('/api/posts');
    
    return <section>
        {isLoading && (
            <div className='flex justify-center mt-32'>
                <PuffSpinner color='cyan' size={80} />
            </div>
        )}
        {posts && (
            <ul>
                {posts && posts.map((post, index) => (
                    <li key={post.id} className='mb-4'>
                        <PostListCard post={post} priority={index < 2} /> {/* 첫번째와 두번째 이미지만 true로 줘서 priority를 설정 */}
                    </li>)
                )}
            </ul>
        )}
    </section>;
}