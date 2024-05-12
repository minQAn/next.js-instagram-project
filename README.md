### Sanity
Sanity는 headless CMS(콘텐츠 관리 시스템)로, 콘텐츠를 생성, 관리, 배포하기 위한 도구이다. Sanity는 데이터를 구조화하고 관리할 수 있는 강력한 툴셋을 제공하며, 웹 애플리케이션에서 콘텐츠를 효과적으로 관리하고 사용하기 위한 API를 제공한다.

### NextAuth
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

흐름도
Sanity Studio ↔️ Content Lake(Sanity) ↔️ Server(Backend with Next.js) ↔️ Frontend





