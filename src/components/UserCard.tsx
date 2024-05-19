import { SearchUser } from '@/model/user';
import Link from 'next/link';
import Avatar from './Avatar';

type Props = {
    user: SearchUser;
}

export default function UserCard({ user: {name, username, email, image, following, followers} }: Props){
    
    return (
        // Next에서 Link를 사용하면 화면 스크롤안의 내용을 prefetching하여 최적화 자동
        <Link             
            href={`/user/${username}`}
            className='flex items-center w-full rounded-sm border border-neutral-300 mb-2 p-4 bg-white hover:bg-neutral-50'
        >
            <Avatar image={image} />
            <div className='text-neutral-500'>
                <p className='text-black font-bold leading-4'>{username}</p>
                <p>{name}</p>
                <p className='text-sm leading-4'>{`${followers} followers ${following} following`}</p>
            </div>
        </Link>
    );
}