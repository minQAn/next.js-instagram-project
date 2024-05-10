'use client';

import Link from "next/link";
import { HomeIcon, HomeFillIcon, NewIcon, NewFillIcon, SearchIcon, SearchFillIcon } from "./ui/icons";
import { usePathname } from "next/navigation";
import ColorButton from "./ui/buttons/ColorButton";
import { useSession, signIn, signOut } from "next-auth/react"


const menu = [
    {
        href: '/',
        icon: <HomeIcon />,
        clickedIcon: <HomeFillIcon />,
    },
    {
        href: '/search',
        icon: <SearchIcon />,
        clickedIcon: <SearchFillIcon />,
    },
    {
        href: '/new',
        icon: <NewIcon />,
        clickedIcon: <NewFillIcon />,
    },
]

export default function Navbar(){
    const pathName = usePathname();
    const { data: session } = useSession(); // data를 session이란 이름으로 변경함


    return <div className='flex justify-between items-center px-6'>
        <Link href='/'>
            <h1 className='text-3xl font-bold'>Instagram</h1>
        </Link>
        <nav>
            <ul className='flex gap-4 items-center p-4'>
                {
                    menu.map(item => <li key={item.href}>
                        <Link href={item.href}>
                            {pathName === item.href ? item.clickedIcon : item.icon}
                        </Link>
                    </li>)
                }
                {
                    session? (<ColorButton text='Sign out' onClick={() => signOut()} />
                    ) : (
                        <ColorButton text='Sign in' onClick={() => signIn()} />
                    )
                }
            </ul>
        </nav>
    </div>
}