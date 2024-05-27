import { createContext, useContext } from 'react';

type CacheKeysValue = {
    postsKey: string; // SWR에서 포스트를 가지고오기 위해 사용할 캐시 키의 값
}

export const CacheKeysContext = createContext<CacheKeysValue>({
    postsKey: '/api/posts', // 기본 값
});

export const useCacheKeys = () => useContext(CacheKeysContext);