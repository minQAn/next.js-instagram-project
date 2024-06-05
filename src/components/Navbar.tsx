'use client';

import Link from "next/link";
import { HomeIcon, HomeFillIcon, NewIcon, NewFillIcon, SearchIcon, SearchFillIcon } from "./ui/icons";
import { usePathname } from "next/navigation";
import ColorButton from "./ui/buttons/ColorButton";
import { useSession, signIn, signOut } from "next-auth/react"
import Avatar from './Avatar';


const menu = [
    {
        href: '/',
        icon: <HomeIcon />,
        clickedIcon: <HomeFillIcon />,
        title: 'Home',
    },
    {
        href: '/search',
        icon: <SearchIcon />,
        clickedIcon: <SearchFillIcon />,
        title: 'Search users',
    },
    {
        href: '/new',
        icon: <NewIcon />,
        clickedIcon: <NewFillIcon />,
        title: 'New Post',
    },
]

export default function Navbar(){
    const pathName = usePathname();
    const { data: session } = useSession(); // client측에서 로그인 정보 가져올 때 사용. data를 session이란 이름으로 변경함
    const user = session?.user; // user 정보. name, email, username, avatar image, expires..

    return <div className='flex justify-between items-center px-6'>
        <Link href='/' aria-label='Home'>
            <h1 className='text-3xl font-bold'>Instagram</h1>
        </Link>
        <nav>
            <ul className='flex gap-4 items-center p-4'>
                {
                    menu.map(item => <li key={item.href}>
                        <Link href={item.href} aria-label={item.title}>
                            {pathName === item.href ? item.clickedIcon : item.icon}
                        </Link>
                    </li>)
                }
                {user && (
                    <li>
                        <Link href={`/user/${user.username}`}>
                            <Avatar image={user.image} size='small' highlight />
                        </Link>
                    </li>
                )}
                <li>
                {
                    session? (<ColorButton text='Sign out' onClick={() => signOut()} />
                    ) : (
                        <ColorButton text='Sign in' onClick={() => signIn()} />
                    )
                }
                </li>
            </ul>
        </nav>
    </div>
}