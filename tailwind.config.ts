import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#241C1D',
        panel: {
          DEFAULT: '#241C1D',
          border: 'rgba(255, 255, 255, 0.10)',
        },
        coral: {
          DEFAULT: '#F0444D',
          dark: '#C92E39',
        },
        ref: {
          bg: '#241C1D',
          panel: '#241C1D',
          red: '#F0444D',
          redDark: '#C92E39',
          text: '#FFFFFF',
          textMuted: '#C5C0C0',
          border: 'rgba(255, 255, 255, 0.10)',
        },
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Geist', 'system-ui', 'sans-serif'],
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
