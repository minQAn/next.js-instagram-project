'use client';

import { ProfileUser } from '@/model/user';
import Button from './ui/buttons/Button';
import useMe from '@/hooks/me';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

type Props = {
    user: ProfileUser;
}


// 로그인한 사용자가 해당 사용자를 팔로우 하고 있는지 먼저 알아야 함
export default function FollowButton({ user }: Props){
    const { username } = user;
    const { user: loggedInUser, toggleFollow } = useMe();
    
    // follow 버튼을 누르면 바뀐 데이터를 리렌더링하기 위해
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const isUpdating = isPending || isFetching;


    // 이 페이지가 로그인사용자가 본인이라면 팔로우 버튼을 가려주기 위함
    const showButton = loggedInUser && loggedInUser.username !== username;
    // 이 사용자 이미 팔로잉하고 있는지 여부 판단
    const following = loggedInUser && loggedInUser.following.find((item) => item.username === username);
    // 팔로잉 여부에 따른 로직
    const text = following ? 'Unfollow' : 'Follow';    

    const handleFollow = async () => {
        setIsFetching(true);
        await toggleFollow(user.id, !following);
        setIsFetching(false);
        startTransition(() => { // isPending이 자동으로 true가 됨
            router.refresh();   // root부터 페이지를 전체 리렌더링하는데 화면깜박임 없이 업데이트된 부분만 리렌더링함
        });
    };

    return (
        <>
            {showButton && (
                <div className='relative'>
                    {isUpdating  && (
                        <div className='absolute z-20 inset-0 flex justify-center items-center'> {/* inset뜻: top, right, bottom, left: 0 */}
                            <PulseLoader size={6} />
                        </div>
                    )}

                    <Button 
                        disabled={isUpdating}
                        text={text} 
                        onClick={handleFollow} 
                        red={text === 'Unfollow'} 
                    />
                </div>
            )}
        </>
    );
}