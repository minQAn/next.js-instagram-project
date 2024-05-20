import { SimplePost } from '@/model/post';
import Image from 'next/image';
import { useState } from 'react';
import ModalPortal from './ui/ModalPortal';
import PostModal from './PostModal';
import PostDetail from './PostDetail';
import { signIn, useSession } from 'next-auth/react';

type Props = {
    post: SimplePost;
    priority: boolean;
}

export default function PostGridCard({ post, priority = false}: Props){
    const {image, username} = post;
    const [ openModal, setOpenModal ] = useState(false);

    // 로그인한 유저만 상세 페이지를 볼 수 있음 
    const {data: session} = useSession();
    const handleOpenPost = () => {
        if(!session?.user) {
            // server component라 redirect는 사용 못 함
            return signIn();
        }
        setOpenModal(true);
    };

    return <div className='relative w-full aspect-square'>
        <Image 
            className='object-cover'
            src={image} 
            alt={`photo by ${username}`} 
            fill 
            sizes='650px' 
            priority={priority} 
            onClick={handleOpenPost}
        />
        {
                openModal && (
                    <ModalPortal>
                        <PostModal onClose={() => setOpenModal(false)}>
                            <PostDetail post={post} />
                        </PostModal>
                    </ModalPortal>
                )
            }

    </div>;
}