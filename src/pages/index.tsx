import type { NextPage } from 'next';
import { PolygonMorphSketch } from 'sketches';

const Home: NextPage = () => {
    return (
        <div className="h-screen w-screen dark:bg-black">
            Hi
            <PolygonMorphSketch />
        </div>
    );
};

export default Home;
