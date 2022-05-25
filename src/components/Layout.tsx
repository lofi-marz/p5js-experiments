import React from 'react';
import Head from 'next/head';
import { WithChildrenProps } from 'types/types';
import { Navbar } from './Navbar';

type LayoutProps = WithChildrenProps;

export default function Layout({ children }: LayoutProps) {
    //TODO: const { height, width } = useWindowDimensions();

    return (
        <div className="flex h-full min-h-screen w-screen flex-col">
            <Head>
                <title>p5.js experiments</title>
                <meta name="description" content="p5.js experiments" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <main className="flex w-full grow flex-col dark:bg-black dark:text-white md:w-1/2">
                {children}
            </main>
        </div>
    );
}
