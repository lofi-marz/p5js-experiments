import type { NextPage } from 'next';
import matter from 'gray-matter';
import {
    findAllSketchFolderNames,
    getSketchDescriptionPath,
    SketchDescription,
} from '../utils/utils';
import fs from 'fs';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

type SketchLinkProps = SketchDescription;

function SketchLink({ slug, title }: SketchLinkProps) {
    return <Link href={`/sketches/${slug}`}>{title}</Link>;
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
        <div className="dark flex h-screen w-screen items-start justify-between bg-black p-10 text-white">
            {links}
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

    console.log(data);

    return {
        props: { sketchDescriptions: data },
    };
}
