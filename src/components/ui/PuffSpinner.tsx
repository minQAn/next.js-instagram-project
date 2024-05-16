import dynamic from 'next/dynamic';

// Lazy Loading
const PuffLoader = dynamic(
    () => import('react-spinners').then(lib => lib.PuffLoader),
    {
        ssr: false, // 서버에서 미리 렌더링하지 말라는 뜻
    }
)

type Props = {
    color?: string;
    size?: number;    
}

export default function PuffSpinner({ color = 'cyan', size}: Props){
    return <PuffLoader color={color} size={size} />;
}