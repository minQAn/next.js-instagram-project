export type User = {
    name: string;
    username: string;
    email: string;
    image?: string;
};

// GROQ 에서 Followings와 Followers의 정보는 username & image만 가져오기로 정의하였기 때문
export type SimpleUser = Pick<User, 'username' | 'image'>;

export type DetailUser = User & {
    following: SimpleUser[]; 
    followers: SimpleUser[];
    bookmarks: string[];
}