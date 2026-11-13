/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          dim: '#15803D',
          glow: 'rgba(34, 197, 94, 0.4)',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          dim: '#B45309',
          glow: 'rgba(245, 158, 11, 0.4)',
        },
        ground: '#0B0E14',
        surface: {
          DEFAULT: '#111520',
          card: '#121622',
          hover: '#181F30',
          border: '#20283A',
        },
        plate: '#121622',
        'plate-border': '#20283A',
        'plate-hover': '#181F30',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        terminal: {
          green: '#22C55E',
          'green-glow': '#4ADE80',
          'green-dim': '#15803D',
          amber: '#F59E0B',
          'amber-bright': '#FBBF24',
          crimson: '#EF4444',
          cyan: '#34D399',
          purple: '#F59E0B',
          pink: '#F59E0B',
          muted: '#8E9BAE',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Jost', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'Jost', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Overpass Mono', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      },
      boxShadow: {
        'bento': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(32, 40, 58, 0.8)',
        'bento-hover': '0 8px 30px -4px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.35)',
        'glow-primary': '0 0 20px rgba(34, 197, 94, 0.35)',
        'glow-secondary': '0 0 20px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
