import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00E5FF',
        secondary: '#7C4DFF',
        success: '#00E676',
        warning: '#FF9100',
        danger: '#FF1744',
        surface: {
          DEFAULT: 'rgba(10, 16, 32, 0.65)',
          light: 'rgba(16, 24, 48, 0.8)',
          lighter: 'rgba(24, 36, 72, 0.95)',
        },
        bg: {
          DEFAULT: '#040814',
          card: 'rgba(10, 16, 32, 0.65)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 229, 255, 0.2)', borderColor: 'rgba(0, 229, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)', borderColor: 'rgba(0, 229, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
