import path from 'path';
import * as fs from 'fs';

export const SKETCH_PATH = path.join(process.cwd(), '/src/sketches/');

export type SketchDescription = {
    slug: string;
    title: string;
};

export function findAllSketchFolderNames() {
    return fs.readdirSync(SKETCH_PATH).filter((p) => {
        const mdxPath = path.join(SKETCH_PATH, p, 'description.mdx');
        return !p.endsWith('.mdx') && fs.existsSync(mdxPath);
    });
    // Only include md(x) files
}

export function findAllSketchDescriptionFullPaths() {
    return fs
        .readdirSync(SKETCH_PATH)
        .filter((p) => {
            const mdxPath = path.join(SKETCH_PATH, p, 'description.mdx');
            return !p.endsWith('.mdx') && fs.existsSync(mdxPath);
        })
        .map((folder) => path.join(SKETCH_PATH, folder, 'description.mdx'));
    // Only include md(x) files
}

export function getSketchDescriptionPath(kebabCaseSketchName: string) {
    return path.join(SKETCH_PATH, kebabCaseSketchName, 'description.mdx');
}
