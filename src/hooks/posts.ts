import { useCacheKeys } from '@/context/CacheKeysContext';
import { Comment, SimplePost } from '@/model/post';
import { useCallback } from 'react';
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

export default function usePosts(cacheKey: string = '/api/posts') {    
    const cacheKeys = useCacheKeys();
    // console.log(cacheKeys.postsKey);

    const { data: posts, isLoading, error, mutate } = useSWR<SimplePost[]>(cacheKeys.postsKey); // bound mutate & cacheKey from context 
    // const { mutate } = useSWRConfig();

    const setLike = useCallback((post: SimplePost, username: string, like: boolean) => {
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
    }, [posts, mutate]);

    const postComment = useCallback((post: SimplePost, comment: Comment) => {
        const newPost = {
            ...post, 
            comments: post.comments + 1,            
        };
        const newPosts = posts?.map(p => p.id === post.id ? newPost : p);

        // 14-8 Revalidate 참고
        return mutate(addComment(post.id, comment.comment), { // bound mutate options
            optimisticData: newPosts,
            populateCache: false,
            revalidate: false,
            rollbackOnError: true, // 네트워크 요청 시 잘못되면 rollback되도록 설정
        })
    }, [posts, mutate]);

    return { posts, isLoading, error, setLike, postComment };
}