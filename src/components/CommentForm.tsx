import { SmileIcon } from './ui/icons';

export default function CommentForm(){
    return (
        <form className='flex items-center border-t border-neutral-300 px-3'>
        <SmileIcon />
            <input 
                className='w-full ml-2 border-none outline-none p-3'
                type='text' 
                placeholder='Add a comment...' 
            />
            <button className='font-bold text-sky-500 ml-2'>Post</button>
        </form>
    );
}