'use client';

import { Comment, SimplePost } from '@/model/post';
import Image from 'next/image';
import ActionBar from './ActionBar';
import { useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import PostUserAvatar from './PostUserAvatar';
import usePosts from '@/hooks/posts';

type Props = {
    post: SimplePost;
    priority?: boolean;
}

export default function PostListCard({ post, priority = false}: Props){
    const { username, userImage, image, comments, text } = post;
    const [ openModal, setOpenModal ] = useState(false); // 기본적으로는 modal이 전달되지 않도록 false로 설정
    const { postComment } = usePosts();
    const handlePostComment = (comment: Comment) => {
        postComment(post, comment);
    };

    return (
        <article className='rounded-lg shadow-md border border-gray-200'>
            <PostUserAvatar image={userImage} username={username} />            
            <Image 
                className='w-full aspect-square object-cover '
                src={image} 
                alt={`photo by ${username}`} 
                width={500} 
                height={500} 
                priority={priority}
                onClick={() => setOpenModal(true)}
            />
            <ActionBar post={post} onComment={handlePostComment}>            
                <p>
                    <span className='font-bold mr-2'>{username}</span>
                    {text}
                </p>    
                {comments > 1 && (
                    <button 
                        className='font-bold my-2 text-sky-400'
                        onClick={() => setOpenModal(true)}
                    >
                            {`View all ${comments} comments`}
                    </button>)
                }       
            </ActionBar>

            {/* Modal */}
            {
                openModal && (
                    <ModalPortal>
                        <PostModal onClose={() => setOpenModal(false)}>
                            <PostDetail post={post} />
                        </PostModal>
                    </ModalPortal>
                )
            }
        </article>
    );
}