import { SimplePost } from '@/model/post';
import { client, urlFor } from './sanity';

// GROQ 사용
// post.author.username -> post.username으로 가능하게 하기 위한 작업
const simplePostProjection = `
    ...,
    "username": author->username,
    "userImage": author->image,    
    "image": photo,
    "likes": likes[]->username,
    "text": comments[0].comment,
    "comments": count(comments),
    "id": _id,
    "createdAt":_createdAt,
`;

// Join query
export async function getFollowingPostsOf(username: string) {
    return client.fetch(
        `*[_type == "post" && author->username == "${username}"
            || author._ref in *[_type == "user" && username == "${username}"].following[]._ref]
            | order(_createdAt desc){${simplePostProjection}}
        `
    ).then(posts => posts.map((post: SimplePost) => ({...post, image: urlFor(post.image)}))); // "image": photo 를 그냥 post.image로 덮어씀
}

// for PostDetail
export async function getPost(id: string) {
    return client.fetch(
        `*[_type == "post" && _id == "${id}"][0]{
            ...,
            "username": author->username,
            "userImage": author->image,
            "image": photo,
            "likes": likes[]->username,
            comments[]{
                comment, 
                "username": author->username, 
                "image": author->image,                
            },
            "id":_id,
            "createdAt":_createdAt 
        }`
    ).then(post => ({...post, image: urlFor(post.image)}));
}

// ----------------------------------------------------
// in UserPosts

export async function getPostsOf(username: string) {
    return client.fetch(`
        *[_type == "post" && author->username == "${username}"]
        | order(_createdAt desc){
            ${simplePostProjection}
        }
    `).then(mapPosts); // posts => mapPosts(posts)
}

// Posts에 누가 좋아요를 눌렀는지 정보를 가져오기 위함
export async function getLikedPostsOf(username: string) {
    return client.fetch(`
        *[_type == "post" && "${username}" in likes[]->username] 
        | order(_createdAt desc){
            ${simplePostProjection}
        }
    `).then(mapPosts); // posts => mapPosts(posts)
}

// Join Query
export async function getSavedPostsOf(username: string) {
    return client.fetch(`
        *[_type == "post" && _id in *[_type == "user" && username=="${username}"].bookmarks[]._ref]
        | order(_createdAt desc){
            ${simplePostProjection}
        }
    `).then(mapPosts);
}

function mapPosts(posts: SimplePost[]) {
    return posts.map((post: SimplePost) => ({
        ...post,
        image: urlFor(post.image),
    }));
}

// ---
// PATCH to update Likes and Bookmarks 
// https://www.sanity.io/docs/js-client#patchupdate-a-document
export async function likePost(postId: string, userId: string) {
    return client.patch(postId) // Document ID to patch 
        .setIfMissing({likes: []}) // 만일 likes가 없으면 빈 배열로 설정
        .append('likes', [  // 기존에 likes가 있다면 해당 객체 아이템을 추가
            {
                _ref: userId,
                _type: 'reference'
            }
        ])
        .commit({autoGenerateArrayKeys: true});  // Perform the patch and return a promise. | authoGenerateArrayKeys 키를 자동으로 생성      
}

export async function dislikePost(postId: string, userId: string) {
    return client.patch(postId) //
        .unset([`likes[_ref=="${userId}"]`]) // 배열에서 likes에 있는 userId를 뺌
        .commit();
}