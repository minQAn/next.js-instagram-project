import Image from 'next/image';

type Props = {
    image?: string | null; 
}

export default function Avatar({ image }: Props){
    return <div className={`w-10 h-10 rounded-full bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300 p-[0.15rem]`}>
        <img 
            className='rounded-full p-[0.05rem]' 
            alt='user profile' 
            src={image ?? undefined} 
            referrerPolicy='no-referrer' /* 외부링크 이미지를 사용해서 나타나는 X박스 이슈가 사라짐  */
        />
    </div>;
}   