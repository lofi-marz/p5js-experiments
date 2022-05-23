import type { NextPage } from 'next';
import { PolygonMorphSketch } from 'sketches';

const Home: NextPage = () => {
    return (
        <div className="dark h-screen w-screen bg-black">
            Hi
            <PolygonMorphSketch />
        </div>
    );
};

export default Home;
