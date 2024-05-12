import FollowingBar from '@/components/FollowingBar';
import PostList from '@/components/PostList';
import SideBar from '@/components/SideBar';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // 로그인한 사용자가 없다면 Signin 페이지로 이동
  if(!user) {
    redirect('/auth/signin');
  }


  return <section className='flex flex-col md:flex-row max-w-[850px] p-4'>
    <div className='w-full basis-3/4'>
      <FollowingBar />
      <PostList />
    </div>
    <div className='basis-1/4'>
      <SideBar user={user} />
    </div>
  </section>;
}
