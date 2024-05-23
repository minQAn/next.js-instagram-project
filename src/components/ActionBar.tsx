// 'use client';
// 여기서 use client를 안해도 되는 이유
// use client를 선언하면 그 자손 컴포넌트들 까지 모두 client 컴포넌트로 간주하기 때문 
// PostListCard -> ActionBar
// PostListCard -> PostDetail -> ActionBar
// PostGridCard -> PostDetail -> ActionBar

import { parseDate } from '@/util/date';
import { BookmarkFillIcon, BookmarkIcon, HeartFillIcon, HeartIcon } from './ui/icons';
import ToggleButton from './ui/buttons/ToggleButton';
import { SimplePost } from '@/model/post';
import usePosts from '@/hooks/posts';
import useMe from '@/hooks/me';

type Props = {
    post: SimplePost;
    children?: React.ReactNode;
}

export default function ActionBar({ post, children }: Props){
    const { id, likes, createdAt } = post;
    
    // const {data: session} = useSession();
    // const user = session?.user;
    const {user, setBookmark} = useMe();
    const {setLike} = usePosts(); // used mutate
    
    // * likes
    // const [liked, setLiked] = useState(user ? likes.includes(user.username) : false);
    const liked = user ? likes.includes(user.username) : false; // 상위 PostList에서 받아온 like정보를 실시간으로 업데이트
    
    // * bookmarks
    // const [bookmarked, setBookmarked] = useState(false);
    const bookmarked = user?.bookmarks.includes(id) ?? false;
    
    // custom hook
    const handleLike = (like: boolean) => {
        user && setLike(post, user.username, like);
    }

    const handleBookmark = (bookmark: boolean) => {
        user && setBookmark(id, bookmark);
    }
    
    return <>
        <div className='flex justify-between m-2 px-3'>
            <ToggleButton 
                toggled={liked} 
                onToggle={handleLike} 
                onIcon={<HeartFillIcon />} 
                offIcon={<HeartIcon />} 
            />
            <ToggleButton 
                toggled={bookmarked} 
                onToggle={handleBookmark} 
                onIcon={<BookmarkFillIcon />} 
                offIcon={<BookmarkIcon />} 
            />
        </div>
        <div className='px-4 py-1'>
            <p className='text-sm font-bold mb-2'>
                {`${likes?.length ?? 0} ${likes?.length > 1 ? 'likes' : 'like'}`}
            </p>

            {/* PostList에서는 보여주지만 PostDetail에서는 안보여주기 때문에 */}
            { children }  

            <p className='text-xs text-neutral-500 uppercase my-1'>{parseDate(createdAt)}</p>
        </div>
    </>;
}