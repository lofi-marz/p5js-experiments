// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                logo: ['Poppins', 'sans-serif'],
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                biggle: {},
                flip: {
                    '0, 100%': { transform: 'scaleY(100%)' },
                    '50%': { transform: 'scaleY(0%)' },
                },
            },
            animation: {
                wiggle: 'wiggle 0.5s ease-in-out 1',
                biggle: 'biggle 0.5s ease-in-out 1',
                flip: 'flip 0.5s ease-in-out',
            },
            colors: {
                'theme-green': '#9FAA9F',
                'theme-sand': '#E7CDAC',
                'theme-beige': '#E1D3C8',
                'theme-bg-light': '#E9E8E3',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
