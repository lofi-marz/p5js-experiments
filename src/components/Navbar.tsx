import React from 'react';
import { useRouter } from 'next/router';

export const Navbar = (): JSX.Element => {
    const router = useRouter();
    return (
        <header className="sticky z-10 flex h-16 w-full items-center justify-between p-5 font-title text-3xl shadow dark:bg-black dark:text-white">
            <h1 onClick={router.back} className="">
                back
            </h1>
        </header>
    );
};
