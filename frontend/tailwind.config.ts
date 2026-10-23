import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        'orange-primary': '#E87524',
        'orange-dark': '#C95D16',
        'orange-pale': '#FFF1E5',
        'orange-focus': '#A94F13',
        // Surfaces
        'bg-base': '#F7F7F5',
        'bg-card': '#FFFFFF',
        // Text
        'text-main': '#252525',
        'text-secondary': '#747474',
        // Borders
        'border-default': '#E7E5E2',
        // Semantic
        'success-text': '#287A4B',
        'success-bg': '#EAF6EE',
        'warning-text': '#A86413',
        'warning-bg': '#FEF6EB',
        'error-text': '#B42318',
        'error-bg': '#FDF2F2',
        // Legacy Stitch tokens for compatibility
        'primary': '#9a4600',
        'primary-container': '#e87524',
        'on-primary': '#ffffff',
        'on-primary-container': '#4f2000',
        'secondary': '#5e5e5e',
        'on-secondary': '#ffffff',
        'secondary-container': '#e3e2e2',
        'on-secondary-container': '#646464',
        'tertiary': '#9e4300',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#e8742e',
        'on-tertiary-container': '#501e00',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'background': '#fcf9f8',
        'on-background': '#1b1c1c',
        'surface': '#fcf9f8',
        'on-surface': '#1b1c1c',
        'surface-variant': '#e4e2e1',
        'on-surface-variant': '#574237',
        'surface-tint': '#9a4600',
        'surface-dim': '#dcd9d9',
        'surface-bright': '#fcf9f8',
        'surface-container': '#f0eded',
        'surface-container-low': '#f6f3f2',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e4e2e1',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f3f0ef',
        'inverse-primary': '#ffb68d',
        'outline': '#8a7265',
        'outline-variant': '#dec1b2',
        'primary-fixed': '#ffdbc9',
        'primary-fixed-dim': '#ffb68d',
        'on-primary-fixed': '#321200',
        'on-primary-fixed-variant': '#763300',
        'secondary-fixed': '#e3e2e2',
        'secondary-fixed-dim': '#c7c6c6',
        'on-secondary-fixed': '#1b1c1c',
        'on-secondary-fixed-variant': '#464747',
        'tertiary-fixed': '#ffdbcb',
        'tertiary-fixed-dim': '#ffb691',
        'on-tertiary-fixed': '#341100',
        'on-tertiary-fixed-variant': '#783100',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'section-title': ['18px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '600' }],
        'numeric-stat': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md-medium': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '500' }],
        'label-md': ['13px', { lineHeight: '18px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        'caption': ['11px', { lineHeight: '14px', letterSpacing: '0.03em', fontWeight: '500' }],
      },
      borderRadius: {
        'DEFAULT': '0.375rem', // 6px
        'sm': '0.125rem',
        'md': '0.375rem',     // 6px - controls
        'lg': '0.5rem',       // 8px - buttons
        'xl': '0.625rem',     // 10px - cards
        '2xl': '0.75rem',     // 12px - modals
        'none': '0',
        'full': '9999px',
      },
      spacing: {
        'gutter': '1.5rem',
        'gutter-mobile': '1rem',
        'margin': '2rem',
        'margin-mobile': '1rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(37, 37, 37, 0.05), 0 1px 2px rgba(37, 37, 37, 0.04)',
        'elevated': '0 8px 24px rgba(37, 37, 37, 0.08)',
        'focus': '0 0 0 2px #A94F13',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        'spin-slow': 'spin-slow 1s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
