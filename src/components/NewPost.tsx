'use client';  // onClick을 사용함으로

import { AuthUser } from '@/model/user';
import PostUserAvatar from './PostUserAvatar';
import FilesIcon from './ui/icons/FilesIcon';
import Button from './ui/buttons/Button';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

type Props = {
    user: AuthUser;
}

export default function NewPost({ user: { username, image } }: Props){
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File>(); // for image File

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
    }

    return (
        <section className='w-full max-w-xl flex flex-col items-center mt-6'>
            <PostUserAvatar username={username} image={image ?? ''} />
            <form className='w-full flex flex-col mt-2'>
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
                />
                <Button text='Publish' onClick={() => {}} />
            </form>
        </section>
    );
}