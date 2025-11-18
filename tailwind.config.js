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
        'stone': '#F2F0EA',
        'ink': '#050505',
        'orange': '#FF3333', /* International Orange */
        'ink-light': 'rgba(5, 5, 5, 0.4)',
        'ink-faint': 'rgba(5, 5, 5, 0.2)',
        'stone-light': 'rgba(242, 240, 234, 0.4)',
        'stone-faint': 'rgba(242, 240, 234, 0.2)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'pulse-orange': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
}
