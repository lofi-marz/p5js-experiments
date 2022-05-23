import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import * as fs from 'fs';
import matter from 'gray-matter';
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
                const s = (sketch + 'Sketch') as SketchComponent;
                return mod[s] ?? mod['SnakeSketch'];
            }),
        {
            ssr: false,
        }
    );

    return (
        <div className="dark h-screen w-screen bg-black text-white">
            Hi {sketch}
            <DynamicSketch />
            <MDXRemote {...source} />
        </div>
    );
};

export default SketchPage;

export async function getStaticProps({ params }) {
    // MDX text - can be from a local file, database, anywhere
    //TODO: Make a const for this
    console.log(process.cwd());
    const filePath = path.join(
        process.cwd(),
        '/src/sketches/',
        'polygon-morph',
        'description.mdx'
    );
    const source = fs.readFileSync(filePath);

    const { content, data } = matter(source);

    const mdxSource = await serialize(content, {
        // Optionally pass remark/rehype plugins
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
        },
        scope: data,
    });

    return {
        props: {
            source: mdxSource,
            frontMatter: data,
        },
    };
}

export async function getStaticPaths() {
    return {
        paths: [{ params: { sketch: 'PolygonMorph' } }],
        fallback: true, // false or 'blocking'
    };
}
