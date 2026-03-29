/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4F1E1',
          card: '#FCFAF2',
        },
        sage: {
          DEFAULT: '#789B73',
          light: '#A8C4A3',
          dark: '#5A7A56',
        },
        earth: {
          DEFAULT: '#4A443A',
          muted: '#737067',
        },
        chamomile: '#E8C872',
        tag: {
          soul: { bg: '#F1E8D9', text: '#A48A63' },
          ocean: { bg: '#E2EDF8', text: '#7BA4C7' },
          loss: { bg: '#F4E3E3', text: '#C28B8B' },
          growth: { bg: '#E5F0E5', text: '#7EA87E' },
          blue: { bg: '#E2EBFA', text: '#6A8AC2' },
          love: { bg: '#F8E2E8', text: '#C4728A' },
        },
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        poetry: '1.8',
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(120, 155, 115, 0.08)',
        'soft-lg': '0 16px 50px rgba(120, 155, 115, 0.12)',
        'soft-xl': '0 24px 60px rgba(120, 155, 115, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
