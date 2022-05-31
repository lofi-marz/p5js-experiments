import React from 'react';
import { useRouter } from 'next/router';

export const Navbar = (): JSX.Element => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white font-title text-3xl shadow dark:bg-black dark:text-white">
            <button className="link h-16 px-5" onClick={router.back}>
                back
            </button>
        </header>
    );
};
