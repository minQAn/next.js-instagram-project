import { HomeUser } from '@/model/user';
import { useCallback } from 'react';
import useSWR from 'swr';


async function updateBookmark(postId: string, bookmark: boolean) {
    return fetch('/api/bookmarks', {
        method: 'PUT',
        body: JSON.stringify({ id: postId, bookmark }),
    }).then(res => res.json());
    // .then(() => mutate('/api/posts')); // mutate key
}

export default function useMe() {
    const { data: user, isLoading, error, mutate } = useSWR<HomeUser>('/api/me'); // bound mutate
    // const { mutate } = useSWRConfig();

    // 성능 개선을 위해 자동으로 리렌더링 되지 않게 하기 위해
    const setBookmark = useCallback((postId: string, bookmark: boolean) => {
            // 사용자가 없을 수도 있음으로
            if(!user) return;
     
            const bookmarks = user.bookmarks;
            const newUser = {
                ...user,
                bookmarks: bookmark ? [...bookmarks, postId] : bookmarks.filter(b => b !== postId),
            };
    
            // 14-8 Revalidate 참고
            return mutate(updateBookmark(postId, bookmark), { // bound mutate options
                optimisticData: newUser,
                populateCache: false,
                revalidate: false,
                rollbackOnError: true, // 네트워크 요청 시 잘못되면 rollback되도록 설정
            });
        },
        [user, mutate]   
    );

    return { user, isLoading, error, setBookmark };
}