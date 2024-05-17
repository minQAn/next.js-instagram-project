'use client';

import { ProfileUser } from '@/model/user';
import { FormEvent, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import useSWR from 'swr';

export default function UserSearch(){
    // /api/search/${keyword}
    // 1. 검색하는 keyword가 있다면 /api/search/bob -> username, name
    // 2. 검색하는 keywordrk 없다면 /api/search -> 전체 유저에 대한 배열을 보냄
    const [keyword, setKeyword] = useState('');
    const { data: users, isLoading, error } = useSWR<ProfileUser[]>(`/api/search/${keyword}`);
    
    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    autoFocus 
                    placeholder='Search for a username or name' 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </form>

            {error && <p>에러 발생</p>}
            {isLoading && <PuffLoader />}
            {!isLoading && !error && users?.length === 0 && (
                <p>찾는 사용자가 없습니다</p>
            )}
            
            {/* 검색결과 */}
            {users && users.map(user => (
                <li key={user.username}>
                    <p>{user.username}</p>
                </li>
            ))}
        </>
    );
}