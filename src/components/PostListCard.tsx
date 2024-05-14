import { SimplePost } from '@/model/post';
import Avatar from './Avatar';
import Image from 'next/image';
import { BookmarkIcon, HeartIcon, SmileIcon } from './ui/icons';
import { parseDate } from '@/util/date';

type Props = {
    post: SimplePost;
}

export default function PostListCard({post}: Props){
    const { username, userImage, image, text, createdAt, likes, comments } = post;
    return <>
        <div>
            <Avatar image={userImage} highlight />
            <span>{username}</span>            
        </div>
        <Image src={image} alt={`photo by ${username}`} width={500} height={500} />
        <div>
            <HeartIcon/>
            <BookmarkIcon />
        </div>
        <div>
            <p>{`${likes?.length ?? 0} ${likes?.length > 1 ? 'likes' : 'like'}`}</p>
            <p>
                <span>{username}</span>
                {text}
            </p>            
            <p>{parseDate(createdAt)}</p>
            <form>
                <SmileIcon />
                <input type='text' placeholder='Add a comment...' />
                <button>Post</button>
            </form>
        </div>
    </>;
}