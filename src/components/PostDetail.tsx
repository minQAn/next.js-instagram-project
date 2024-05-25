import { SimplePost } from '@/model/post';
import Image from 'next/image';
import PostUserAvatar from './PostUserAvatar';
import ActionBar from './ActionBar';
import Avatar from './Avatar';
import useFullPost from '@/hooks/post';

type Props = {
    post: SimplePost;
}

export default function PostDetail({ post }: Props){
    const { id, userImage, username, image } = post;
    const { post: data, postComment } = useFullPost(id);
    const comments = data?.comments; // comment, username, image,          

    return (
        <section className='flex w-full h-full'>
            <div className='relative basis-3/5'> {/* 자식요소에서 fill을 사용했기때문에 relative 필요 */}
                <Image 
                    className='object-over'
                    src={image} 
                    alt={`photo by ${username}`} 
                    priority 
                    fill
                    sizes='650px'
                />  {/* width는 650px로 가져가되 높이는 relative한 부모까지 fill(가득채우라는) 해주라는 뜻 */}
            </div>
            <div className='w-full basis-2/5 flex flex-col'>
                <PostUserAvatar image={userImage} username={username} />

                <ul className='border-t border-gray-200 h-full overflow-y-auto p-4 mb-1'>
                    {comments && comments.map(({ username: commentUsername, image, comment }, index) => (
                        <li 
                            key={index} 
                            className='flex items-center mb-1'
                        >
                            <Avatar image={image} size='small' highlight={commentUsername === username} />
                            <div className='ml-2'>
                                <span className='font-bold mr-1'>{commentUsername}</span>
                                <span>{comment}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <ActionBar post={post} onComment={postComment} />
            </div>
        </section>
    );
}