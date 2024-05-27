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
        bookmarks: [],
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
            // console.log(user);
            if(!user) {return undefined;} //유저가 없는 경우 이렇게 해줘야 컴포넌트에서 요청시 에러 안남
            
            return {
                ...user, 
                following: user.following ?? 0,
                followers: user.followers ?? 0,
                posts: user.posts ?? 0,
            }
        });
}

// For Bookmarks
export async function addBookmark(userId: string, postId: string) {
    return client
        .patch(userId) // Document ID to patch, bookmarks는 사용자의 스키마를 업데이트 해야함 
        .setIfMissing({ bookmarks: [] }) // 만일 likes가 없으면 빈 배열로 설정
        .append('bookmarks', [  // 기존에 likes가 있다면 해당 객체 아이템을 추가
            {
                _ref: postId,
                _type: 'reference'
            }
        ])
        .commit({autoGenerateArrayKeys: true});  // Perform the patch and return a promise. | authoGenerateArrayKeys 키를 자동으로 생성      
}

export async function removeBookmark(userId: string, postId: string) {
    return client
        .patch(userId) //
        .unset([`bookmarks[_ref=="${postId}"]`]) // 배열에서 bookamrks의 아이디가 요청한 postId와 동일한 것을 뺌
        .commit();
}

// Follow
// Multiple mutate transaction
export async function follow(myId: string, targetId: string) {
    return client
        .transaction() //
        .patch(myId, (user) => 
            user
                .setIfMissing({following: []})
                .append('following', [{_ref: targetId, _type: 'reference'}]) // following하고 싶은 사람의 targetId를 추가
        )
        .patch(targetId, (user) => 
            user
                .setIfMissing({followers: []})
                .append('followers', [{_ref: myId, _type: 'reference'}]) // user가 팔로우 했음으로 해당 유저의 팔로워에 나를 추가
        )
        .commit({autoGenerateArrayKeys: true});
} 

// Unfollow
export async function unfollow(myId: string, targetId: string) {
    return client
        .transaction() //
        .patch(myId, (user) => 
            user.unset([`following[_ref]=="${targetId}"`])
        )
        .patch(targetId, (user) => 
            user.unset([`followers[_ref]=="${myId}"`])
        )
        .commit({autoGenerateArrayKeys: true});
}