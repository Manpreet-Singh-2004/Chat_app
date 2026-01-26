"use client"
import { useEffect } from 'react';
import {
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import {ModeToggle} from './ModeToggle'
import Link from 'next/link'
import {House } from 'lucide-react'
import {Button} from './ui/button'
import { fetchProfileAtom } from '@/app/store/users/user.controller';
import useAuthApi from '@/app/api/Auth'
import { useSetAtom } from 'jotai';


const Navbar = ()=>{

    const api = useAuthApi()
    const fetchProfile = useSetAtom(fetchProfileAtom)

    useEffect(() => {
        fetchProfile(api);
    }, [fetchProfile, api])

    return(
        <div className='flex items-center justify-between'>
            <Link href={'/'} className='ml-10 flex gap-2'>
            <p><House  /></p>
            <p className='font-bold'>Home</p>
            </Link>
            <div className='flex items-center py-7 px-5 justify-end gap-5'>
                <ModeToggle />
                <SignedOut>
                    <Link href={'/sign-in'}>
                        <Button>
                            Get Started
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar