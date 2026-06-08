/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006B3F',
        accent: '#FCD116',
        danger: '#CE1126',
        dark: '#1A1A1A',
        muted: '#6B7280',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'scaleIn': 'scaleIn 0.3s ease-out',
        'scaleUp': 'scaleUp 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

