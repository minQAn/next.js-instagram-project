'use client';  // onClick을 사용함으로

import { AuthUser } from '@/model/user';
import PostUserAvatar from './PostUserAvatar';
import FilesIcon from './ui/icons/FilesIcon';
import Button from './ui/buttons/Button';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import PuffSpinner from './ui/PuffSpinner';
import { useRouter } from 'next/navigation';

type Props = {
    user: AuthUser;
}

export default function NewPost({ user: { username, image } }: Props){
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File>(); // for image File
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const textRef = useRef<HTMLTextAreaElement>(null); // textarea에서 onChange로 변경하면 변경할때마다 리렌더링되어 깜빡이게 됨으로 방지하기 위해 사용

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();         
        
        const files = e.target?.files; // 파일 전송이 잘 끝났는지 확인
        if(files && files[0]) {
            setFile(files[0]);            
        }
    };
    const handleDrag = (e: React.DragEvent) => {
        if(e.type === 'dragenter') {
            setDragging(true);
        } else if(e.type === 'dragleave') {
            setDragging(false);
        }
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // 이미지를 드래그해서 드랍했을 때 이미지를 자동으로 브라우저에서 오픈하는걸 막아줌
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); // 브라우저의 기본적인 행동을 취소
        setDragging(false);
        
        const files = e.dataTransfer?.files; // 파일 전송이 잘 끝났는지 확인
        if(files && files[0]) {
            setFile(files[0]);            
        }
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', textRef.current?.value ?? '');

        fetch('/api/posts/', { method: 'POST', body: formData }) //
            .then(res => { 
                if(!res.ok) { // 파일 업데이트가 실패한한 경우.. 
                    setError(`${res.status} ${res.statusText}`);
                    return;
                }
                router.push('/');
            })
            .catch(err => setError(err.toString()))
            .finally(() => setLoading(false));
    };

    return (
        <section className='w-full max-w-xl flex flex-col items-center mt-6'>
            {loading && (
                <div className='absolute inset-0 z-50 flex justify-center pt-[30%] bg-sky-500/30'>
                    <PuffSpinner color='red' />
                </div>
            )}
            {error && (
                <p className='w-full bg-red-100 text-red-500 text-center p-4 mb-4 font-bold'>testsdf</p>
            )}
            <PostUserAvatar username={username} image={image ?? ''} />
            <form className='w-full flex flex-col mt-2' onSubmit={handleSubmit}>
                <input 
                    className='hidden' 
                    name='input' 
                    id='input-upload' 
                    type='file' 
                    accept='image/*'
                    onChange={handleChange} 
                />
                <label 
                    className={`w-full h-60 flex flex-col items-center justify-center ${!file && 'border-2 border-sky-500 border-dashed'}`}
                    htmlFor='input-upload'
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop}
                >
                    {/* 파일이 드래깅 되어 해당 위치에 올라올 때 화면 전체 파랗게 표시 */}
                    {dragging && 
                        <div className='absolute inset-0 z-10 bg-sky-500/20 pointer-events-none' />
                    }
                    {/* 파일이 없을 때 */}
                    {!file && 
                        <div className='flex flex-col items-center pointer-events-none'>
                            <FilesIcon />
                            <p>Drag and Drop your image here or click</p>
                        </div>
                    }
                    {file && 
                        <div className='relative w-full aspect-square'>
                            <Image 
                                className='object-cover'
                                src={URL.createObjectURL(file)} 
                                alt='local file' 
                                fill 
                                sizes='650px' 
                            />
                        </div>
                    }
                    
                </label>
                <textarea 
                    className='outline-none text-lg border border-neutral-300'
                    name="text" 
                    id="input-text" 
                    required 
                    rows={10} 
                    placeholder={'Write a caption'} 
                    ref={textRef}
                />
                <Button text='Publish' onClick={() => {}} />
            </form>
        </section>
    );
}