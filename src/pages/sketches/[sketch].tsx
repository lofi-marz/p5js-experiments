import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import * as fs from 'fs';
import matter from 'gray-matter';
import {
    findAllSketchFolderNames,
    getSketchDescriptionPath,
} from '../../utils/utils';
import { kebabToPascalCase } from '../../utils/sketchNameConverter';
import { Suspense } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const SketchPage: NextPage = ({ source, frontMatter }: MDXRemoteProps) => {
    const router = useRouter();
    const { sketch } = router.query;

    const DynamicSketch = dynamic(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () =>
            import('sketches').then((mod) => {
                type SketchComponent = keyof typeof mod;
                const componentName =
                    kebabToPascalCase(sketch as string) + 'Sketch';
                console.log(`Loading ${componentName}`);
                const s = componentName as SketchComponent;
                if (mod[s]) return mod[s];
                router.push('sketches/snake');
            }),
        {
            ssr: false,
        }
    );
    //TODO: I don't actually know if this suspense does anything
    return (
        <div>
            <Suspense fallback={<div className="w-full">Loading...</div>}>
                <div className="mx-auto md:w-3/4">
                    <DynamicSketch />
                </div>
            </Suspense>
            <div className="prose prose-neutral mx-auto w-full grow p-5 py-10 font-text prose-headings:font-title dark:prose-invert">
                <h1 className="font-bold dark:text-white">
                    {frontMatter.title}
                </h1>
                <h3 className="italic">tldr: {frontMatter.description}</h3>
                <div className="py-5">
                    <MDXRemote {...source} />
                </div>
            </div>
        </div>
    );
};

export default SketchPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // MDX text - can be from a local file, database, anywhere
    //TODO: Make a const for this
    console.log(params);
    const filePath = getSketchDescriptionPath(params?.sketch as string);
    const source = fs.readFileSync(filePath);

    const { content, data } = matter(source);
    console.log(content);
    const mdxSource = await serialize(content, {
        // Optionally pass remark/rehype plugins
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
        },
        scope: data,
    });
    console.log(mdxSource);

    return {
        props: {
            source: mdxSource,
            frontMatter: data,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    const names = findAllSketchFolderNames();
    return {
        paths: names.map((name) => {
            return { params: { sketch: name } };
        }),
        fallback: true, // false or 'blocking'
    };
};
