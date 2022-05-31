import type { NextPage } from 'next';
import matter from 'gray-matter';
import {
    findAllSketchFolderNames,
    getSketchDescriptionPath,
    SketchDescription,
} from '../utils/utils';
import fs from 'fs';
import Link from 'next/link';

type SketchLinkProps = SketchDescription;

function SketchLink({ slug, title }: SketchLinkProps) {
    return (
        <Link href={`/sketches/${slug}`}>
            <a className="link w-1/2 bg-white p-5 ">{title}</a>
        </Link>
    );
}

type SketchesGalleryProps = {
    sketchDescriptions: SketchDescription[];
};

const SketchesGalleryPage: NextPage<SketchesGalleryProps> = ({
    sketchDescriptions,
}) => {
    console.log(sketchDescriptions);
    const links = sketchDescriptions.map((s) => (
        <SketchLink key={s.slug} {...s} />
    ));
    return (
        <div className="flex h-full w-full flex-col items-start justify-between p-10 dark:bg-black dark:text-white">
            <div className="py-10">
                I needed somewhere to store all my p5 sketches, this was also a
                little chance to develop my own CMS. The descriptions for each
                sketch are stored in a .mdx file and loaded in, and the sketch
                itself is dynamically imported <br />
                <br /> anyway here they are:
            </div>
            <div className="flex flex-wrap gap-5">{links}</div>
        </div>
    );
};

export default SketchesGalleryPage;

export async function getStaticProps() {
    const sketchDescriptions = findAllSketchFolderNames();

    const data = sketchDescriptions.map((sketch) => {
        const fullPath = getSketchDescriptionPath(sketch);
        const source = fs.readFileSync(fullPath);
        const { data } = matter(source);
        return { slug: sketch, ...data };
    });

    return {
        props: { sketchDescriptions: data },
    };
}
