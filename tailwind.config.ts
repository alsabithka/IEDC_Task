import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          muted: 'var(--bg-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        btn: {
          'primary-bg': 'var(--btn-primary-bg)',
          'primary-text': 'var(--btn-primary-text)',
          'primary-hover': 'var(--btn-primary-hover)',
          'secondary-bg': 'var(--btn-secondary-bg)',
          'secondary-text': 'var(--btn-secondary-text)',
          'secondary-border': 'var(--btn-secondary-border)',
          'secondary-hover': 'var(--btn-secondary-hover)',
        },
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      transitionDuration: {
        fast: '150ms',
      },
    },
  },
  plugins: [],
} satisfies Config
