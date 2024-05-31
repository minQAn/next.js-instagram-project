b## Navbar

### Sanity 사용
Sanity는 headless CMS(콘텐츠 관리 시스템)로, 콘텐츠를 생성, 관리, 배포하기 위한 도구이다. Sanity는 데이터를 구조화하고 관리할 수 있는 강력한 툴셋을 제공하며, 웹 애플리케이션에서 콘텐츠를 효과적으로 관리하고 사용하기 위한 API를 제공한다.

### NextAuth  사용
NextAuth는 인증 및 인가를 처리하기 위한 라이브러리로, 웹 애플리케이션에서 사용자를 인증하고 권한을 부여하는 데 사용된다. 다양한 인증 프로바이더(예: Google, Facebook, GitHub 등)와 함께 작동하여 사용자의 로그인 및 세션 관리를 간편하게 처리할 수 있다.

> 두 기술을 함께 사용. 
Sanity를 사용하여 콘텐츠를 관리하는 웹 애플리케이션을 개발하고, NextAuth를 사용하여 사용자를 인증하고 권한을 관리한다. 이를 통해 안전하고 효율적으로 웹 애플리케이션을 구축하였다.

* Sanity를 사용하여 Headless CMS 사용
* Sanity Studio를 사용하여 Fake Data 생성
* NextAuth를 v13 이상 사용하여 로그인 상태 관리
    * Google login 구현(Google Cloud)
* NextAuth 로그인 페이지들 Customized 하여 재구성
* Next.js의 searchParams를 사용하여 callbackUrl을 가져와 로그인을 하면 그전에 있던 페이지로 이동
* next-auth.d.ts 파일에서 session에서 가져오는 user 객체 정보에 username type을 추가 (email의 @ 앞까지 고유한 값으로 -> for Avatar를 누르면 /user/[username] 으로 이동하게 하기위해)
* <a href="https://www.sanity.io/docs/js-client#quickstart">@sanity/client</a>의 createIfNotExists함수를 통해 새로운 유저가 로그인하면 추가되고, 기존에 있던 유저는 중복되어 추가되지 않게됨
* ColorButton & Avatar Components 재사용성 강화 및 파라미터에 따른 크기 처리를 styling 함수로 별도로 처리
    * Avatar component의 이미지는 여러 외부 provider(ex: google, kakao, naver)에서 오기때문에 도메인 지정이 곤란하므로 nextjs의 Image컴포넌트를 사용하지 않았음

흐름도
Sanity Studio ↔️ Content Lake(Sanity) ↔️ Server(Backend with Next.js) ↔️ Frontend

# GET part 

## Sidebar 에서는 스타일링 함수
Navar에있는 Avatar Component 재사용

## FollowingBar
* fetch가아닌 <a href="https://swr.vercel.app/">**SWR**</a>(Stale-While-Revalidate)을 사용. (Vercel에서 만듬)
* Sanity의 <a href="https://www.sanity.io/docs/groq">GROQ</a>를 사용하여 getUserByUsername 함수 구현
* Loding Spinner 구현
* 원활한 가로 스크롤을 위해 [react-multi-carousel](https://www.npmjs.com/package/react-multi-carousel) 라이브러리 사용

참고 자료 링크 </br>
https://swr.vercel.app/ </br>
https://swr.vercel.app/docs/global-configuration </br>
https://www.sanity.io/docs/groq </br>
https://www.davidhu.io/react-spinners/ 


## PostList
* Sanity에서 image가져올 때 [@sanity/image-url](https://www.sanity.io/docs/image-url) 사용 
    * -> 외부 url을 사용할 때 최적화 해서 가져오는 것이 가능하게 함.
* [timeago.js](https://github.com/hustcc/timeago.js/blob/master/README.md) 사용 
* PostListCard component로 구현
    * priority를 처음 이미지 2개를 우선으로 보여주고 나머지는 스크롤링이 되어 컨텐츠 위치에 와야지 보이게 된다.
* PuffLoader에 LazyLoading을 구현.
* PostList 목록에서 처음과 두번째 이미지 까지만 priority를 설정함


## PostDetail 구현 (Modal)
* DOM요소에 의미상으로 좀더 맞게 구현하기 위해 React에서 제공하는 **Portals** 사용 [참고1](https://legacy.reactjs.org/docs/portals.html), [참고2](https://react.dev/reference/react-dom/createPortal)
    * 장점: Props의 최하단 구조에 있는 컴포넌트 일지라도 body에 있는 div에 연결만 해주면 팝업처럼 사용이 가능해진다
* body의 제일 마지막에 ModalPortal component를 생성
* post 데이터에는 comments를 갯수만 props로 SimplePost타입으로 받고 있는데 PostDetail 컴포넌트에서는 comments의 모든 정보를 가져와야 함으로 useSWR로 id를 함께 api로 요청하여 데이터를 다시 받아옴

## UserSearch 
* useSWR을 사용하였기 때문에 UserSearch의 keyword가 변경될 때마다 데이터 요청을 보냄
* GROQ query에 정규식 사용가능하며 검색하려는 key 양옆에 * 를 붙이면 해당 keyword가 포함되는 모든 데이터를 검색함
```tsx
const query = keyword 
        ? `&& (name match "*${keyword}*") || (username match "*${keyword}")`
        : '';

    return client.fetch(`
        *[_type == "user" ${query}]{
            ...,
            "following": count(following),
            "followers": count(followers),
        }
    `)
```
* ⚠️ [Debounce](https://github.com/vercel/swr/issues/110) 적용 
    * **의미: 이벤트가 발생하는 동안은 기다렸다가 잠잠해지면 그때 처리하도록 하는 것**
    * 현재 UserSearch 검색의 문제점: 검색창에 keyword를 입력하는 순간마다 백엔드에 네트워크 요청이 되고 있음(과부하 문제 발생)
    * 해결 방안: 입력 혹은 삭제 도중에는 네트워크 요청을 안하고, 입력이나 삭제가 끝나면 요청하도록
    * useDebounce 동작원리: setTimeout으로 delay함. 또한 delay가 끝나기도 전에 다른 요청이 오면 기존의 요청은 clearTimeout으로 취소하게 되어있음. 그러므로 제일 마지막에 설정한 타임아웃이 useState값에 설정이되며 실행됨
* vs [Throttle](https://redd.one/blog/debounce-vs-throttle)
    * **의미: Debounce와는 조금 다르게 이벤트가 지속적으로 발생하면 duration으로 일정한 간격으로 끊어서 처리해줌**

    
## UserProfile
* getUserForProfile 함수 참고

## UserPosts
* posts, liked, saved 세가지 탭으로 구성
* 이에 따른 세가지 query를 posts 서비스에 작성
* image-url + Image 컴포넌트로 최적화
* Home에서 작성한 post detail페이지의 Modal 재사용
* priority 상위 6개의 이미지에만 적용하여 최적화
* Grid 사용

## SEO를 위해 Metadata 작성
* /user/[username]에서는 params를 가져와야함으로 generateMetadata함수 사용
* getUserForProfile 함수가 여러번 반복됨으로 react의 cache를 사용하여 함수로 묶음
* authOptions은 별도로 객체로 빼었음
* Search에서 nextjs의 fetch를 사용하지 않았기 때문에 SSG로 행동하는데 이를 강제로 서버 사이드 렌더링으로 만들기 위해 search route.ts와 page.tsx에 아래 코드 추가하여 빌드
```tsx
export const dynamic = 'force-dynamic';
```

---
# POST part

## [SWR advanced understaning](https://swr.vercel.app/docs/advanced/understanding) (for better UX)
* SWR뜻(Stale While Revalidate): stale된 데이터를 리벨리데이션 하는 동안에 사용한다.
    * 두번째 부터 데이터를 서버에 요청하는 동안 SWR은 기존의 staled된 데이터를 보여주고 뒤에서는 업데이트 된 내용이 있는지 서버에 체크후, 데이터가 변경된 사항이 있다면 UI에 업데이트 시켜준다는 동작원리
* isLoading: 데이터 첫 요청시에만 true가됨. 이유는 두번 째 요청부터는 staled된 데이터를 이미 가지고 있기 때문에
* isValidating: 이미 기존에 가지고 있는 데이터를 보여주고, true가되며 데이터가 백그라운드에서 업데이트가 되면 false로 변경함
* Key: 내부 컴포넌트 상태에 따라서 key가 바뀌는 경우가 있음

## 재사용 가능한 ToggleButton 컴포넌트 구현 for like and bookmarks 
* [sanity client](https://www.sanity.io/docs/js-client)
* [next-auth/configuration/callbacks](https://next-auth.js.org/configuration/callbacks)
* [SWR Mutation](https://swr.vercel.app/docs/mutation)
* ActionBar에서 use client 선언을 하지 않은 이유: 
   부모 컴포넌트에서 이미 client 컴포넌트로 선언했기 때문에 그 자손 컴포넌트들 까지 모두 client 컴포넌트로 간주하기 때문 
    PostListCard -> ActionBar
    PostListCard -> PostDetail -> ActionBar
    PostGridCard -> PostDetail -> ActionBar
* mutation 사용하여 /api/posts를 key로 지정하고 like의 상태가 바뀐걸 전달하여 실시간 업데이트(service/sanity.ts에 있는 useCdn:false로 지정해야 ui가 동적으로 바뀜 ->  수정: service -> posts.ts -> getFollowingPostsOf 함수에 useCdn옵션을 줬음)
* 별도의 usePosts custom hooks 으로 리팩토링하여 데이터를 관리
* optimistic UI update 구현
    * 구현이유: like버튼을 누르면 바로 ui가 바뀌어야하는데 데이터가 로드되기까지 기다렸다가 바뀌는 것이 ux가 좋지 않음으로
    * mutate 함수를 사용하지 않고 useSWR('/api/posts')의 [bound mutate](https://swr.vercel.app/docs/mutation.en-US#bound-mutate)를 사용
* like와 bookmark 버튼을 누르면 user 페이지에서는 데이터 적용이 안되는데 useCdn옵션과 연관이 있어 false로 변경함(추후 정확한 파악 필요 -> 확인 결과 cache를 no-cache로 설정했어야함. 아래 설명)
* 중요 포인트!!: getLikedPostsOf와 getSavedPostsOf에 3번째 인자로 [cache: 'no-cahce'](https://nextjs.org/docs/app/building-your-application/caching)를 설정해야 User페이지에 있는 PostGrid가 실시간으로 업데이트 된다. 
    * 설명: Next에서 자체적으로 client.fetch url에 대한 response를 캐싱에서 json파일로 revalidate 시간을 아주 길게해서 저장하고 있기 때문에.
    * .next/cache/fetch-cache 폴더에서 json파일로 확인 가능


## Comment 댓글 입력 POST 구현
* POST api 구현 및 리펙토링
* Post가 업데이트 되었을 때 전체적인 포스트가 변경이 되지 않아서 사용자가 Detail화면에서 Comment를 입력했으나 전체 Home에서는 업데이트가 되지 않는 문제 발견
    * 이렇게 불가피하게 서로 연결된(바운드된) mutate로 해결할 수 없는 경우에 사용할 수 있는 것이 Global mutate 이다. (in post.ts)
    * global mutate에 '/api/posts'키를 설정함으로 써 이제 PostDetail에서 Comment트를 입력하고나면 Home에서 코멘트 갯수가 업데이트 되는 것을 확인할 수 있다

## Follow Button 
* [Multiple mutations in a transaction](https://www.sanity.io/docs/php-client#multiple-mutations-in-a-transaction) 사용
    * 사용이유: follow버튼을 누르는 순간 다수의 사용자(user와 해당 follow한 사용자)의 데이터를 바꿔야 하기 때문
* useMe hook을 전달받으면 toggleFollow라는 함수를 전달 받을 수 있도록 추가
* Follow Button을 눌러 데이터 업데이트 시, client componenet의 정적으로 받아온 following & followers의 숫자는 변하지 않고 있음
    * 해결방법: [router.refresh()](https://nextjs.org/docs/app/building-your-application/caching#invalidation-1) 사용: router.refresh를 사용하여 서버상에 미리 렌더링된 페이지도 부분적으로 업데이트 가능함
    * react에서 제공하는 [useTransition](https://react.dev/reference/react/useTransition) 사용하여 데이터가 변경이 되는 동안 spinner보여줄 수도 있음
    * 현재 이방법은 Next에서 어떻게 처리할지 고안중임을 참고
* CSS 팁
```tsx
<div className='absolute inset-0 flex justify-center items-center'> 
</div>
{/* inset뜻: top, right, bottom, left: 0 */}
// absolte를하고 위치값을 정하면 flex가 적용이 가능하다
```

## User페이지에 있는 PostGrid에서 Like 버튼을 누르면 바뀌지 않는 버그
* 현재 Home에서 보는 post list는 PostList 컴포넌트에서 관리하고 있음
    * 여기서는 usePosts hook을 사용하여 PostListCard에 각각 보여주고 있음
    * 원인: like를 누르면 /api/posts 라는 것을 업데이트하는데 그럼 Home에 있는 것은 전체적으로 업데이트가 되겠지만 PostGrid에서 사용하는 api key는 /api/users/${username}/${query}로 서로 다르기 때문
    * 이를 해결하기 위해 cacheKey를 Actionbar에 있는 setLike에  전달해야하는데 Props Drilling이 지나치게 발생하기 때문에 Context를 사용한다
    * -> UserPosts에 있는 PostGrid를 CacheKeysContext로 묶어서 키를 다르게 관리


## NewPost
* Sanity에서 이미지를 올릴 때 [Assets](https://www.sanity.io/docs/assets) 사용  
    * api안에서 사용하는 핸들러에서는 client.assets.upload 사용이 불가능하다고 하여 수동적으로 post요청을 함
* handleDrag, handleDragOver, handleDrop으로 이미지 드래그&드랍 이벤트 처리
* handleChange로 클릭해서 파일 이미지 선택

