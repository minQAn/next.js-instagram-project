import { SearchUser } from '@/model/user';
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
            "id":_id,
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
        users.map((user: SearchUser) => ({
            ...user,
            following: user.following ?? 0,
            followers: user.followers ?? 0,
        }))
    )
}

export async function getUserForProfile(username: string) {
    // 주의사항: join에서 posts부분 count(*[_type="post"])까지 띄어쓰기 있으면 안됨!!!
    return client.fetch(`
            *[_type == "user" && username == "${username}"][0]{
                ...,
                "id":_id,
                "following": count(following),
                "followers": count(followers),
                "posts": count(*[_type=="post" && author->username == "${username}"]) 
            }
        `).then(user => {
            console.log(user);
            if(!user) {return undefined;} //유저가 없는 경우 이렇게 해줘야 컴포넌트에서 요청시 에러 안남
            
            return {
                ...user, 
                following: user.following ?? 0,
                followers: user.followers ?? 0,
                posts: user.posts ?? 0,
            }
        });
}