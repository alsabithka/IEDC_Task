import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        page: '#000000',
        nearblack: '#090909',
        charcoal: '#171717',
        greymedium: '#777777',
        greylight: '#D0D0D0',
        panel: {
          DEFAULT: '#000000',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        ref: {
          bg: '#000000',
          panel: '#090909',
          text: '#FFFFFF',
          textMuted: '#D0D0D0',
          border: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Chakra Petch"', '"Geist Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Anton', '"Archivo Black"', 'Impact', 'sans-serif'],
        tech: ['"Chakra Petch"', '"Geist Mono"', 'monospace'],
      },
      borderRadius: {
        panel: '24px',
      },
      maxWidth: {
        panel: '1180px',
      },
    },
  },
  plugins: [],
} satisfies Config
