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