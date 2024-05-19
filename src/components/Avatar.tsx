type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

type Props = {
    image?: string | null; 
    size?: AvatarSize;
    highlight?: boolean;
}

export default function Avatar({ image, size = 'large', highlight = false }: Props){
    return <div className={getContainerStyle(size, highlight)}>
        {/* 여러 외부 provider(ex: google, kakao, naver)에서 오기때문에 도메인 지정이 곤란하므로 nextjs의 Image컴포넌트를 사용하지 않았음 */}
        <img 
            className={`bg-white object-cover rounded-full ${getImageSizeStyle(size).image}`}
            alt='user profile' 
            src={image ?? undefined} 
            referrerPolicy='no-referrer' /* 외부링크 이미지를 사용해서 나타나는 X박스 이슈가 사라짐  */
        />
    </div>;
}    

function getContainerStyle(size: AvatarSize, highlight: boolean): string {
    const baseStyle = 'rounded-full flex justify-center items-center';
    const highlightStyle = highlight? 'bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300' : '';
    const { container } = getImageSizeStyle(size);
    return `${baseStyle} ${highlightStyle} ${container}`;
}

type ImageSizeStyle = {
    container: string;
    image: string;    
}
function getImageSizeStyle(size: AvatarSize): ImageSizeStyle {
    switch(size) {
        case 'small': 
            return { 
                container: 'w-10 h-10', 
                image: 'w-[34px] h-[34px] p-[0.1rem]'
            };
        case 'medium': 
            return { 
                container: 'w-11 h-11', 
                image: 'w-[42px] h-[42px] p-[0.1rem]'
            };
        case 'large': 
            return { 
                container: 'w-[68px] h-[68px]', 
                image: 'w-16 h-16 p-[0.2rem]'
            };  
        case 'xlarge': 
            return { 
                container: 'w-[142px] h-[142px]', 
                image: 'w-[138px] h-[138px] p-[0.3rem]'
            }; 
        default: throw new Error(`Unsupported type size: ${size}`);
    }  
}