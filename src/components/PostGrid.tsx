import { SimplePost } from '@/model/post';
import { PuffLoader } from 'react-spinners';
import useSWR from 'swr';
import PostGridCard from './PostGridCard';

type Props = {
    username: string;
    query: string;
}

export default function PostGrid({ username, query }: Props){
    const {data: posts, isLoading, error} = useSWR<SimplePost[]>(`/api/users/${username}/${query}`);
    // console.log(posts);
    return <div>
        {isLoading && <PuffLoader color='cyan'/>}
        <ul>
            {posts && posts.map((post, index) => <li key={post.id}>
                <PostGridCard post={post} priority={index < 6} />
            </li>)}
        </ul>
    </div>;
}