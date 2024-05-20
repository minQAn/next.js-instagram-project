export type AuthUser = {
    name: string;
    username: string;
    email: string;
    image?: string;
};

// GROQ 에서 Following와 Followers의 정보는 username & image만 가져오기로 정의하였기 때문
export type SimpleUser = Pick<AuthUser, 'username' | 'image'>;

export type HomeUser = AuthUser & {
    following: SimpleUser[]; 
    followers: SimpleUser[];
    bookmarks: string[];
}

export type SearchUser = AuthUser & {
    following: number;
    followers: number;
}

export type ProfileUser = SearchUser & {
    posts: number;
}