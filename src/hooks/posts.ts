import { SimplePost } from '@/model/post';
import useSWR from 'swr';

// to update like
async function updateLike(id: string, like: boolean) {
    return fetch('/api/likes', {
        method: 'PUT',
        body: JSON.stringify({ id, like }),
    }).then(res => res.json());
    // .then(() => mutate('/api/posts')); // mutate key
}

// to update comment
async function addComment(id: string, comment: string) {
    return fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ id, comment }),
    }).then(res => res.json()); 
}

export default function usePosts() {
    const { data: posts, isLoading, error, mutate } = useSWR<SimplePost[]>('/api/posts'); // bound mutate
    // const { mutate } = useSWRConfig();

    const setLike = (post: SimplePost, username: string, like: boolean) => {
        const newPost = {
            ...post, 
            likes: like
            ? [...post.likes, username] 
            : post.likes.filter(item => item !== username),
        };
        const newPosts = posts?.map(p => p.id === post.id ? newPost : p);

        // 14-8 Revalidate 참고
        return mutate(updateLike(post.id, like), { // bound mutate options
            optimisticData: newPosts,
            populateCache: false,
            revalidate: false,
            rollbackOnError: true, // 네트워크 요청 시 잘못되면 rollback되도록 설정
        })
    };

    const postComment = (post: SimplePost, comment: string) => {
        const newPost = {
            ...post, 
            comments: post.comments + 1,            
        };
        const newPosts = posts?.map(p => p.id === post.id ? newPost : p);

        // 14-8 Revalidate 참고
        return mutate(addComment(post.id, comment), { // bound mutate options
            optimisticData: newPosts,
            populateCache: false,
            revalidate: false,
            rollbackOnError: true, // 네트워크 요청 시 잘못되면 rollback되도록 설정
        })
    };

    return { posts, isLoading, error, setLike, postComment };
}