import { ProfileUser } from '@/model/user';
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

// for searching user
export async function searchUsers(keyword?: string | null) {
    /*
        ? `&& (name match "*${keyword}*") || (username match "*${keyword}*")`
        ㄴ위와같이하면 r 로하면 레이첼과 무람다 등 r이들어간 유저가 다뜹니다. 이렇게 정규표현식도 가능하더군요
    */
    const query = keyword 
        ? `&& (name match "*${keyword}*") || (username match "*${keyword}")`
        : '';

    return client.fetch(`
        *[_type == "user" ${query}]{
            ...,
            "following": count(following),
            "followers": count(followers),
        }
    `).then(users => 
        users.map((user: ProfileUser) => ({
            ...user,
            following: user.following ?? 0,
            followers: user.followers ?? 0,
        }))
    )
}