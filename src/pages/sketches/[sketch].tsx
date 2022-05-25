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
                return mod[s] ?? mod['SnakeSketch'];
            }),
        {
            ssr: false,
        }
    );

    return (
        <div className="dark h-screen w-screen bg-black text-white">
            <DynamicSketch />
            <div className="w-full p-5 font-text">
                <h1 className="font-title text-6xl font-bold">
                    {frontMatter.title}
                </h1>
                <h2 className="font-text font-title text-lg font-light italic">
                    {frontMatter.description}
                </h2>
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
