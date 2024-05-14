import { SimplePost } from '@/model/post';
import Avatar from './Avatar';
import Image from 'next/image';
import { BookmarkIcon, HeartIcon } from './ui/icons';
import { parseDate } from '@/util/date';
import CommentForm from './CommentForm';
import ActionBar from './ActionBar';

type Props = {
    post: SimplePost;
    priority?: boolean;
}

export default function PostListCard({ post, priority = false}: Props){
    const { username, userImage, image, text, createdAt, likes, comments } = post;
    return (
        <article className='rounded-lg shadow-md border border-gray-200'>
            <div className='flex items-center p-2'>
                <Avatar image={userImage} highlight size='medium' />
                <span className='text-gray-800 font-bold ml-2'>{username}</span>            
            </div>
            <Image 
                className='w-full aspect-square object-cover '
                src={image} 
                alt={`photo by ${username}`} 
                width={500} 
                height={500} 
                priority={priority}
            />
            <ActionBar likes={likes} username={username} text={text} createdAt={createdAt} />
            <CommentForm />
        </article>
    );
}