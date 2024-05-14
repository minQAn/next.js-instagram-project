import dynamic from 'next/dynamic';

// Lazy Loading
const PuffLoader = dynamic(
    () => import('react-spinners').then(lib => lib.PuffLoader),
    {
        ssr: false,
    }
)

type Props = {
    color?: string;
    size?: number;    
}

export default function PuffSpinner({ color = 'cyan', size}: Props){
    return <PuffLoader color={color} size={size} />;
}