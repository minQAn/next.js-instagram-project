import reactDom from 'react-dom';

type Props = {
    children: React.ReactNode;
}

export default function ModalPortal({ children }: Props){
    
    // 브라우저 환경이 아니라면 아무것도 반환하지 않음
    // 이유: 서버사이드 렌더링도 가능한데 이것을 하지 않게하기 위해서
    if(typeof window === 'undefined') {
        return null;
    }

    // 전달되는 모든 children 요소들을 body에있는 id='portal' div에 연결해준다
    const node = document.getElementById('portal') as Element;
    return reactDom.createPortal(children, node);
}