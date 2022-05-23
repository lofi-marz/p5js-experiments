import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const Sketch: NextPage = () => {
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
        </div>
    );
};

export default Sketch;
