import { client } from './sanity';

type OAuthUser = {
    id: string;
    email: string;
    name: string;
    username: string;
    image?: string | null;    
}

// 사용자가 로그인 했을때 사용하기 위함, createIfNotExits를 통해 기존 사용자는 새로 추가 안됨
export async function addUser({ id, email, name, username, image } : OAuthUser) {
    return client.createIfNotExists({
        _id: id,
        _type: 'user', // schema type
        email,
        name,
        username,
        image,
        following: [],
        followers: [],
        bookmarks: []
    })
}

// used it for FollowingBar Component
// GROQ 사용: https://www.sanity.io/docs/groq
export async function getUserByUsername(username: string) {
    return client.fetch(
        `*[_type == "user" && username == "${username}"][0]{
            ...,
            "id": _id,
            following[]->{username,image},
            followers[]->{username,image},
            "bookmarks":bookmarks[]->_id
        }`
    )
}