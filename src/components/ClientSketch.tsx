import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), {
    ssr: false,
});
