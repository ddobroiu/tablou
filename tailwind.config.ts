import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Optimizări pentru reducerea dimensiunii CSS-ului
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'card-bg': 'var(--card-bg)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-600': 'var(--accent-600)',
        border: 'var(--border)',
        success: 'var(--success)',
      },
      boxShadow: {
        premium: 'var(--shadow-premium)',
        elevated: 'var(--shadow-elevated)',
        soft: 'var(--shadow-soft)',
      },
      borderRadius: {
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      }
    },
  },
  plugins: [],
};

export default config;