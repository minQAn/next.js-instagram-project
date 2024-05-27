import { PuffLoader } from 'react-spinners';
import PostGridCard from './PostGridCard';
import usePosts from '@/hooks/posts';

export default function PostGrid(){
    const {posts, isLoading} = usePosts(); // cacheKey가 달라 like크를 눌러도 반응이 없어 context로 받아옴
    // const {data: posts, isLoading, error} = useSWR<SimplePost[]>(`/api/users/${username}/${query}`);    
    
    return <div className='w-full'>        
        {isLoading && 
            <div className='w-full flex justify-center'>
                <PuffLoader color='cyan'/>
            </div>
        }

        <ul className='grid grid-cols-3 gap-4 py-4 px-8'>
            {posts && posts.map((post, index) => <li key={post.id}>
                <PostGridCard post={post} priority={index < 6} />
            </li>)}
        </ul>
    </div>;
}