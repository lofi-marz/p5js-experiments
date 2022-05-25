import React from 'react';
import { useRouter } from 'next/router';

export const Navbar = (): JSX.Element => {
    const router = useRouter();
    return (
        <header className="z-10 flex h-16 w-full items-center justify-between p-5 font-title text-3xl shadow dark:bg-black dark:text-white">
            <h1 onClick={router.back}>back</h1>
            <h1>p5.js</h1>
            <h1>back</h1>
        </header>
    );
};
