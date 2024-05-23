export type Comment = {
    comment: string;
    username: string;
    image?: string | undefined;    
};

// 포스트 목록을 보여주는 SimplePost에서는 댓글의 갯수만 보여주기위해서
export type SimplePost = Omit<FullPost, 'comments'> & {
    comments: number;
}

export type FullPost = {
    id: string;
    username: string;
    userImage: string;
    image: string;
    text: string;
    createdAt: string;
    likes: string[];
    comments: Comment[];
};