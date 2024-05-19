import { useState, useEffect } from 'react';

export default function useDebounce(value: string, delay: number = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler); // setTimeout이 끝나지 않았는데 value가 변경이되면 예전 timeout은 취소
    }, [value, delay]);

    return debounced;
}