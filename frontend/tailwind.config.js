/** @type {import('tailwindcss').Config} */
module.exports = {
  // These paths tell Tailwind CSS where your components and pages are,
  // so it can scan them for used utility classes and generate the necessary CSS.
  darkMode: 'class', // Enable dark mode support

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // For pages in a 'pages' directory (if you used it)
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}', // For all components
    // './src/app/**/*.{js,ts,jsx,tsx,mdx}', 
           // For all App Router pages and layouts
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here.
      // For example, custom colors, fonts, spacing, etc.
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Custom font family for Inter
      },
      boxShadow: { // Ensure your custom shadows are extended here
        '3xl': '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.05)',
        '4xl': '0 30px 60px -15px rgba(0, 0, 0, 0.3), 0 0 20px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [], // Add any Tailwind CSS plugins here (e.g., @tailwindcss/forms)
};