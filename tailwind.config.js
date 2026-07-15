/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: '#EFEBE1',
          panel: '#F7F4EC',
          ink: '#1C2438',
          inkSoft: '#4B5468',
          rule: '#D8D1BF',
          accent: '#D9531E',
          accentSoft: '#F0C8B4',
          success: '#2F8F5B',
          successSoft: '#CFE6D8',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        stamp: '0 1px 0 rgba(28,36,56,0.06), 0 8px 20px -12px rgba(28,36,56,0.25)',
      },
    },
  },
  plugins: [],
}
