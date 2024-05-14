'use client';

import { DetailUser } from '@/model/user';
import Link from 'next/link';
import { PropagateLoader } from 'react-spinners';
import useSWR from 'swr';
import Avatar from './Avatar';
import ScrollableBar from './ui/ScrollableBar';

// 1. 클라이언트 컴포넌트에서 백엔드에게 api/me 사용자의 정보를 얻어옴
// 2. 백엔드에서는 현재 로그인된 사용자의 세션 정보를 이용해서 
//    백엔드에서 사용자의 상세 정보를 Sanity에서 가지고 옴 (Followings)
// 3. 클라이언트 컴포넌트에서 followings의 정보를 UI에 보여줌
//    -> (image, username)

// Loading Spinner: https://www.davidhu.io/react-spinners/ 
export default function FollowingBar(){
    const {data, isLoading, error} = useSWR<DetailUser>('/api/me');
    // console.log(data?.following); // type을 정의했기 때문에 받아오는 data의 타입을 알 수 있음
    const followingUsers = data?.following;
    // const followingUsers = undefined;
    // const followingUsers = data?.following && [
    //     ...data?.following, 
    //     ...data?.followers, 
    //     ...data?.following,
    //     ...data?.followers,
    //     ...data?.following,
    // ];
    
    return <section className='w-full flex justify-center items-center p-4 shadow-sm shadow-neutral-300 mb-4 rounded-lg min-h-[80px] overflow-x-auto'>
        {isLoading ? (<PropagateLoader size={12} color='cyan' />
        ) : (
            (!followingUsers || followingUsers.length === 0) && <p>{`You don't have following users`}</p>
        )}
        {
            followingUsers && followingUsers.length > 0 && (                
                <ScrollableBar>
                    {followingUsers.map(({image, username}) => 
                        <Link 
                            key={username}
                            className='flex flex-col items-center w-20'
                            href={`/user/${username}`}
                            >
                            <Avatar image={image} highlight />
                            <p className='w-full text-sm text-center text-ellipsis overflow-hidden'>{username}</p>
                        </Link>
                    )}
                </ScrollableBar>                
        )}
    </section>;
}