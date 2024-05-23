import { Comment, FullPost } from '@/model/post';
import useSWR from 'swr';

// to update comment
async function addComment(id: string, comment: string) {
    return fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ id, comment }),
    }).then(res => res.json()); 
}

export default function useFullPost(postId: string) {
    const { data: post, isLoading, error, mutate } = useSWR<FullPost>(`/api/posts/${postId}`); // bound mutate
    // const { mutate } = useSWRConfig();

    const postComment = ( comment: Comment ) => {
        if(!post) return;

        const newPost = {
            ...post, 
            comments: [...post.comments, comment],       
        };

        // 14-8 Revalidate 참고
        return mutate(addComment(post.id, comment.comment), { // bound mutate options
            optimisticData: newPost,
            populateCache: false,
            revalidate: false,
            rollbackOnError: true, // 네트워크 요청 시 잘못되면 rollback되도록 설정
        })
    };

    return { post, isLoading, error, postComment };
}