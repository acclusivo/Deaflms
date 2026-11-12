import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
        /* Acclusivo Corporate & DeafLMS Product Palette */
        brand: {
          deep: '#00177D',        /* Core corporate identity & strong headings */
          primary: '#1B4EA7',     /* Corporate Blue / Education Blue: CTAs, nav, links */
          hover: '#00177D',       /* CTA hover */
          indigo: '#3847AF',      /* Innovation Indigo: Ayo AI Tutor */
          muted: '#5871B0',       /* Supporting brand blue */
          periwinkle: '#ABB8D7',  /* Soft supporting surfaces */
          mist: '#F5F7FC',        /* Light interface background */
          border: '#E5EAF3',      /* Dividers and component borders */
          text: '#1F2937',        /* Deep Slate: Main text */
          secondary: '#64748B',   /* Slate Grey: Secondary text */
        },
        learning: {
          DEFAULT: '#087F8C',     /* Learning Teal: Progress & interactive states */
          50: '#E6F4F6',
          100: '#CCEEF1',
          500: '#087F8C',
          600: '#076B76',
          700: '#065A63',
          900: '#032B2F',
        },
        achievement: {
          DEFAULT: '#F4B942',     /* Achievement Gold: Rewards, badges, stars */
          50: '#FEF7E8',
          100: '#FDF0D2',
          400: '#F4B942',
          500: '#E09F2B',
          700: '#8F6010',
          900: '#422A04',
        },
        deaf: {
          indigo: {
            50: '#eef2ff',
            100: '#e0e7ff',
            500: '#3847af',
            600: '#1b4ea7',
            700: '#00177d',
            900: '#001054',
          },
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#15803d',
            600: '#166534',
            700: '#14532d',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            400: '#f4b942',
            500: '#e09f2b',
            600: '#b45309',
          },
          coral: {
            50: '#fff1f2',
            500: '#b91c1c',
            600: '#991b1b',
          },
          slate: {
            50: '#f5f7fc',
            100: '#e5eaf3',
            200: '#cbd5e1',
            800: '#1e293b',
            900: '#1f2937',
            950: '#111827',
          },
        },
        animation: {
          'star-pop': 'starPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          'wiggle': 'wiggle 0.3s ease-in-out',
          'visual-pulse': 'visualPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          starPop: {
            '0%': { transform: 'scale(0.5)', opacity: '0' },
            '80%': { transform: 'scale(1.25)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          wiggle: {
            '0%, 100%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(-4deg)' },
            '75%': { transform: 'rotate(4deg)' },
          },
          visualPulse: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.6' },
          },
        },
      },
    },
    plugins: [],
  };

export default config;
