type AvatarSize = 'small' | 'medium' | 'large';

type Props = {
    image?: string | null; 
    size?: AvatarSize;
    highlight?: boolean;
}

export default function Avatar({ image, size = 'large', highlight = false }: Props){
    return <div className={getContainerStyle(size, highlight)}>
        {/* 여러 외부 provider(ex: google, kakao, naver)에서 오기때문에 도메인 지정이 곤란하므로 nextjs의 Image컴포넌트를 사용하지 않았음 */}
        <img 
            className={`bg-white object-cover rounded-full ${getImageSizeStyle(size)}`}
            alt='user profile' 
            src={image ?? undefined} 
            referrerPolicy='no-referrer' /* 외부링크 이미지를 사용해서 나타나는 X박스 이슈가 사라짐  */
        />
    </div>;
}    

function getContainerStyle(size: AvatarSize, highlight: boolean): string {
    const baseStyle = 'rounded-full flex justify-center items-center';
    const highlightStyle = highlight? 'bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300' : '';
    const sizeStyle = getContainerSize(size);
    return `${baseStyle} ${highlightStyle} ${sizeStyle}`;
}

function getContainerSize(size: AvatarSize): string {
    switch(size) {
        case 'small': return 'w-10 h-10';
        case 'medium': return 'w-11 h-11';
        case 'large': return 'w-[68px] h-[68px]';        
    }  
}

function getImageSizeStyle(size: AvatarSize): string | Error {
    switch(size) {
        case 'small': return 'w-[34px] h-[34px] p-[0.1rem]';
        case 'medium': return 'w-[42px] h-[42px] p-[0.1rem]';
        case 'large': return 'w-16 h-16 p-[0.2rem]';
        default: return new Error('Wrong Size');
    }            
}