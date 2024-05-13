export default {
    title: 'Post',
    name: 'post',
    type: 'document',
    fields: [
        {
            title: 'Author',
            name: 'author',
            type: 'reference',
            to: [{type: 'user'}],            
        },
        {
            title: 'Photo',
            name: 'photo',
            type: 'image'
        },
        {
            title: 'Likes',
            name: 'likes',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'user'}]
                },
            ],
            validation: (Rule) => Rule.unique(),
        },
        {
            title: 'Comments',
            name: 'comments',
            type: 'array',
            of: [
                {
                    title: 'Comment',
                    name: 'comment',
                    type: 'document',
                    fields: [
                        {
                            title: 'Author',
                            name: 'author',
                            type: 'reference',
                            to: [{type: 'user'}]
                        },
                        {
                            title: 'Comment',
                            name: 'comment',
                            type: 'string',
                        },
                    ],               
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'comments.0.comment',
            authorName: 'author.name',
            authorUsername: 'author.username',
            media: 'photo',
        },
        prepare(selection) { /* customize하여 sanity studio에서 보여주고 싶은 데이터 값을 설정 */
            const { title, authorName, authorUsername, media } = selection;
            return {
                title,
                subtitle: `by ${authorName} (${authorUsername})`,
                media,
            }
        }
    }
}