import React from 'react';
import Head from 'next/head';
import { WithChildrenProps } from 'types/types';
import { Navbar } from './Navbar';

type LayoutProps = WithChildrenProps;

export default function Layout({ children }: LayoutProps) {
    //TODO: const { height, width } = useWindowDimensions();

    return (
        <div className="dark">
            <div className="flex h-full min-h-screen w-screen flex-col items-center justify-center dark:bg-black">
                <Head>
                    <title>p5.js experiments</title>
                    <meta name="description" content="p5.js experiments" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar />
                <main className="flex w-full grow flex-col dark:bg-black dark:text-white md:w-3/4">
                    {children}
                </main>
            </div>
        </div>
    );
}
