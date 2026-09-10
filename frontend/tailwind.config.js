/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mine: {
          bg: '#0B0F12',
          surface: '#11171B',
          elevated: '#161D21',
          highlight: '#1C262C',
          border: '#273036',
          borderLight: '#37454E',
          text: '#F1F5F5',
          secondary: '#9BA8AD',
          muted: '#69767B',
        },
        status: {
          safe: '#10B981',
          safeBg: 'rgba(16, 185, 129, 0.12)',
          safeBorder: 'rgba(16, 185, 129, 0.35)',
          warning: '#F59E0B',
          warningBg: 'rgba(245, 158, 11, 0.12)',
          warningBorder: 'rgba(245, 158, 11, 0.35)',
          high: '#F97316',
          highBg: 'rgba(249, 115, 22, 0.15)',
          highBorder: 'rgba(249, 115, 22, 0.45)',
          critical: '#EF4444',
          criticalBg: 'rgba(239, 68, 68, 0.18)',
          criticalBorder: 'rgba(239, 68, 68, 0.55)',
          info: '#06B6D4',
          infoBg: 'rgba(6, 182, 212, 0.12)',
          infoBorder: 'rgba(6, 182, 212, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
