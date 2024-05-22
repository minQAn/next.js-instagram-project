'use client';

import { SimplePost } from '@/model/post';
import Avatar from './Avatar';
import Image from 'next/image';
import CommentForm from './CommentForm';
import ActionBar from './ActionBar';
import { useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import PostUserAvatar from './PostUserAvatar';

type Props = {
    post: SimplePost;
    priority?: boolean;
}

export default function PostListCard({ post, priority = false}: Props){
    const { username, userImage, image, text, createdAt, likes, comments } = post;
    const [ openModal, setOpenModal ] = useState(false); // 기본적으로는 modal이 전달되지 않도록 false로 설정

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
            <ActionBar post={post} />
            <CommentForm />
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