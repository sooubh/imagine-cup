import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#f9f506",
                "background-light": "#f8f8f5",
                "background-dark": "#23220f",
                "neutral-dark": "#1c1c0d",
                "neutral-gray": "#9e9d47",
            },
            fontFamily: {
                display: ["Spline Sans", "sans-serif"],
                body: ["Noto Sans", "sans-serif"],
            },
            borderRadius: {
                lg: "1.5rem",
                xl: "2rem",
                "2xl": "3rem",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                toastPop: {
                    '0%': { transform: 'scale(0.8) translateX(100%)', opacity: '0' },
                    '50%': { transform: 'scale(1.05) translateX(0)', opacity: '1' },
                    '100%': { transform: 'scale(1) translateX(0)', opacity: '1' },
                },
            },
            animation: {
                'toast-pop': 'toastPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
