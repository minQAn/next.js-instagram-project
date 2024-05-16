import Avatar from './Avatar';

type Props = {
    image: string;
    username: string;
}

export default function PostUserAvatar({ image, username }: Props){
    return (
        <div className='flex items-center p-2'>
            <Avatar image={image} highlight size='medium' />
            <span className='text-gray-800 font-bold ml-2'>{username}</span>            
        </div>
    );
}