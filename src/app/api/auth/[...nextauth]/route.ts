import { authOptions } from '@/app/lib/auth';
import NextAuth from "next-auth"

// https://console.cloud.google.com/
// Next.js에서는 route.ts 파일에서 임의의 객체를 내보내는 것이 허용되지 않습니다.
// GET, POST, PATCH 등과 같은 이름이 지정된 객체만 내보낼 수 있습니다.
// authOptions와 같은 임의의 객체를 내보내려고 하니 빌드가 실패하게 된 것입니다.

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }