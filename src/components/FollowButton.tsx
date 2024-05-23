'use client';

import { ProfileUser } from '@/model/user';
import Button from './ui/buttons/Button';
import useMe from '@/hooks/me';

type Props = {
    user: ProfileUser;
}


// 로그인한 사용자가 해당 사용자를 팔로우 하고 있는지 먼저 알아야 함
export default function FollowButton({ user }: Props){
    const {username} = user;
    const {user: loggedInUser} = useMe();

    // 이 페이지가 로그인사용자가 본인이라면 팔로우 버튼을 가려주기 위함
    const showButton = loggedInUser && loggedInUser.username !== username;
    // 이 사용자 이미 팔로잉하고 있는지 여부 판단
    const following = loggedInUser && loggedInUser.following.find(item => item.username === username);
    // 팔로잉 여부에 따른 로직
    const text = following ? 'Unfollow' : 'Follow';
    return (
        <>
            {showButton && <Button text={text} onClick={() => {}} red={text === 'Unfollow'} />}
        </>
    );
}