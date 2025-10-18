/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        background: '#ffffff',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#64748b',
          foreground: '#94a3b8',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {                 // slide từ trái sang phải
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 1s ease-out forwards', // animation mới
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic classes that might be purged
    { pattern: /^(bg|text|border|from|to|via|fill|stroke)-.*/ },
    { pattern: /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|h|w|min-h|min-w|max-h|max-w)-.*/ },
    { pattern: /^(grid-cols|col-span|row-span|justify|items|content|place)-.*/ },
    { pattern: /^(rounded|shadow|opacity|z|inset|top|left|right|bottom)-.*/ },
    { pattern: /^(space|divide)-.*/ },
    { pattern: /^(transform|transition|duration|ease)-.*/ },
    // Specific classes used in components
    'bg-primary-500', 'text-primary-600', 'border-primary-200',
    'bg-accent-500', 'text-accent-600', 'border-accent-200',
    'bg-white', 'text-gray-900', 'text-gray-600', 'text-gray-700',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300',
    'border-gray-200', 'border-gray-300', 'border-gray-400',
    'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
    'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
    'p-4', 'p-6', 'p-8', 'px-4', 'py-2', 'py-3', 'py-4',
    'mb-4', 'mb-6', 'mb-8', 'mt-4', 'mt-6', 'mt-8',
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-medium', 'font-semibold', 'font-bold',
    'hover:bg-blue-700', 'hover:bg-gray-100', 'hover:text-blue-600',
    'focus:ring-2', 'focus:ring-blue-500', 'focus:outline-none',
    'transition-all', 'duration-200', 'ease-in-out',
    'flex', 'flex-col', 'flex-row', 'items-center', 'justify-center',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'hidden', 'block', 'inline-block', 'relative', 'absolute',
    'w-full', 'h-full', 'min-h-screen', 'max-w-7xl', 'max-w-md',
    'overflow-hidden', 'overflow-y-auto', 'scrollbar-thin',
    'backdrop-blur-sm', 'bg-black/70', 'bg-white/80',
    'animate-fade-in', 'animate-slide-up', 'animate-slide-in-left',
    'animate-bounce-slow'
  ],
}
