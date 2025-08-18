const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    fontFamily: {
      'montserrat-thin': ['Montserrat_100Thin'],
      'montserrat-extralight': ['Montserrat_200ExtraLight'],
      'montserrat-light': ['Montserrat_300Light'],
      'montserrat': ['Montserrat_400Regular'],
      'montserrat-medium': ['Montserrat_500Medium'],
      'montserrat-semibold': ['Montserrat_600SemiBold'],
      'montserrat-bold': ['Montserrat_700Bold'],
      'montserrat-extrabold': ['Montserrat_800ExtraBold'],
      'montserrat-black': ['Montserrat_900Black'],
      'montserrat-thin-italic': ['Montserrat_100Thin_Italic'],
      'montserrat-extralight-italic': ['Montserrat_200ExtraLight_Italic'],
      'montserrat-light-italic': ['Montserrat_300Light_Italic'],
      'montserrat-italic': ['Montserrat_400Regular_Italic'],
      'montserrat-medium-italic': ['Montserrat_500Medium_Italic'],
      'montserrat-semibold-italic': ['Montserrat_600SemiBold_Italic'],
      'montserrat-bold-italic': ['Montserrat_700Bold_Italic'],
      'montserrat-extrabold-italic': ['Montserrat_800ExtraBold_Italic'],
      'montserrat-black-italic': ['Montserrat_900Black_Italic'],
      sans: ['Montserrat_400Regular', 'ui-sans-serif', 'system-ui'],
      bold: ['Montserrat_700Bold', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
