import { AiOutlineHeart } from 'react-icons/ai';

type Props = {
    className?: string;
}

export default function HeartIcon({ className }: Props){
    return <AiOutlineHeart className={className || 'w-6 h-6'} />;
}