import { NextPage } from 'next';

const TestPage: NextPage = ({ sketchDescriptions }) => {
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

export default TestPage;
