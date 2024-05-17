'use client';

import { ProfileUser } from '@/model/user';
import { FormEvent, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import useSWR from 'swr';
import UserCard from './UserCard';

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
        <section className='w-full max-w-2xl my-4 flex flex-col items-center'>
            <form className='w-full mb-4' onSubmit={onSubmit}>
                <input 
                    className='w-full text-xl p-3 outline-none border border-gray-400'
                    type="text" 
                    autoFocus 
                    placeholder='Search for a username or name' 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </form>

            {error && <p>에러 발생</p>}
            {isLoading && <PuffLoader color='skyblue'/>}
            {!isLoading && !error && users?.length === 0 && (
                <p>찾는 사용자가 없습니다</p>
            )}
            
            {/* 검색결과 */}
            <ul className='w-full p-4'>
                {users && users.map(user => (
                    <li key={user.username}>
                        <UserCard user={user} />
                    </li>
                ))}
            </ul>
        </section>
    );
}