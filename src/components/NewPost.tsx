'use client';  // onClick을 사용함으로

import { AuthUser } from '@/model/user';
import PostUserAvatar from './PostUserAvatar';
import FilesIcon from './ui/icons/FilesIcon';
import Button from './ui/buttons/Button';
import { ChangeEvent, useState } from 'react';

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
            console.log(files[0]);
        }
    };
    const handleDrag = (e: DragEvent) => {
        if(e.type === 'dragenter') {
            setDragging(true);
        } else if(e.type === 'dragleave') {
            setDragging(false);
        }
    };
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault(); // 이미지를 드래그해서 드랍했을 때 이미지를 자동으로 브라우저에서 오픈하는걸 막아줌
    };
    const handleDrop = (e: DragEvent) => {
        e.preventDefault(); // 브라우저의 기본적인 행동을 취소
        setDragging(false);
        
        const files = e.dataTransfer?.files; // 파일 전송이 잘 끝났는지 확인
        if(files && files[0]) {
            setFile(files[0]);
            console.log(files[0]);
        }
    }

    return (
        <section>
            <PostUserAvatar username={username} image={image ?? ''} />
            <form>
                <input 
                    className='hidden' 
                    name='input' 
                    id='input-upload' 
                    type='file' 
                    accept='image/*'
                    onChange={handleChange} 
                />
                <label 
                    htmlFor='input-upload' 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop}
                >
                    <FilesIcon />
                    <p>Drag and Drop your image here or click</p>
                </label>
                <textarea name="text" id="input-text" required rows={10} placeholder={'Write a caption'} />
                <Button text='Publish' onClick={() => {}} />
            </form>
        </section>
    );
}