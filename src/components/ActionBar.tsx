import { parseDate } from '@/util/date';
import { BookmarkIcon, HeartIcon } from './ui/icons';

type Props = {
    likes: string[];
    username: string;
    text: string;
    createdAt: string;
}

export default function ActionBar({ likes, username, text, createdAt }: Props){
    return <>
        <div className='flex justify-between m-2 px-3'>
            <HeartIcon />
            <BookmarkIcon />
        </div>
        <div className='px-4 py-1'>
            <p className='text-sm font-bold mb-2'>
                {`${likes?.length ?? 0} ${likes?.length > 1 ? 'likes' : 'like'}`}
            </p>
            <p>
                <span className='font-bold mr-2'>{username}</span>
                {text}
            </p>            
            <p className='text-xs text-neutral-500 uppercase my-1'>{parseDate(createdAt)}</p>
        </div>
    </>;
}