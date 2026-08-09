/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#F8F9FB',
        primaryTeal: '#0D5C46',
        primaryTealHover: '#094232',
        accentNavy: '#1A3A5C',
        incomeGreen: '#10B981',
        expenseRed: '#EF4444',
        personalBadge: '#8B5CF6',
        businessBadge: '#F59E0B',
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
