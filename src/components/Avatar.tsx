import Image from 'next/image';

type Props = {
    image?: string | null; 
    size?: 'small' | 'normal';
    highlight?: boolean;
}

export default function Avatar({ image, size = 'normal', highlight = false }: Props){
    return <div className={getContainerStyle(size, highlight)}>
        <img 
            className={`bg-white rounded-full ${getImageSizeStyle(size)}`}
            alt='user profile' 
            src={image ?? undefined} 
            referrerPolicy='no-referrer' /* 외부링크 이미지를 사용해서 나타나는 X박스 이슈가 사라짐  */
        />
    </div>;
}    

function getContainerStyle(size: string, highlight: boolean): string {
    const baseStyle = 'rounded-full flex justify-center items-center';
    const highlightStyle = highlight? 'bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300' : '';
    const sizeStyle = size === 'small'? 'w-10 h-10' : 'w-[68px] h-[68px]';    
    return `${baseStyle} ${highlightStyle} ${sizeStyle}`;
}

function getImageSizeStyle(size: string): string {
    return size === 'small'
        ? 'w-[34px] p-[0.1rem]' 
        : 'w-16 h-16 p-[0.2rem]';
}