import { Comment, FullPost } from '@/model/post';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

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

    // * Post가 업데이트 되었을 때 전체적인 포스트가 변경이 되지 않아서 사용자가 Detail화면에서 Comment를 입력했으나 전체 Home에서는 업데이트가 되지 않는 문제 발견
    // -> 불가피하게 서로 연결된(바운드된) mutate로 해결할 수 없는 경우에 사용할 수 있는 것이 Global mutate 이다. (in post.ts)
    const { mutate: globalMutate} = useSWRConfig();

    const postComment = useCallback(( comment: Comment ) => {
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
            }).then(() => globalMutate('/api/posts'));
        },
        [post, mutate, globalMutate]
    );

    return { post, isLoading, error, postComment };
}