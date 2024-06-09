import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xsm': {'max': '639px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'min': '640px', 'max': '767px'},
      // => @media (min-width: 640px and max-width: 767px) { ... }

      'md': {'min': '768px', 'max': '1023px'},
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      'lg': {'min': '1024px', 'max': '1279px'},
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': {'min': '1280px', 'max': '1535px'},
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xl': {'min': '1536px'},
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      animation: {
        'slide': 'slide 5s infinite linear',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      dropShadow: {
        'lgw': '0 5px 8px rgba(255,255,255, 0.4)'
      },
      skew: {
        '90': '90deg',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        "120": "30rem",
      },
      colors: {
        'mystic': {
          '50': '#f7f8f8',
          '100': '#edf0f1',
          '200': '#e0e6e6',
          '300': '#b5c4c4',
          '400': '#8da3a2',
          '500': '#6f8887',
          '600': '#597070',
          '700': '#495b5b',
          '800': '#3f4d4d',
          '900': '#374243',
          '950': '#252b2c',
        },
        'turquoise': {
        '50': '#f0fdfb',
        '100': '#cbfcf5',
        '200': '#97f8ea',
        '300': '#5aeede',
        '400': '#26d2c6',
        '500': '#10bcb3',
        '600': '#0a9793',
        '700': '#0c7976',
        '800': '#0f6060',
        '900': '#124f4e',
        '950': '#032e30',
        },
        'flamingo': {
          '50': '#fff4ed',
          '100': '#fee6d6',
          '200': '#fcc9ac',
          '300': '#faa477',
          '400': '#f77340',
          '500': '#f4511e',
          '600': '#e53611',
          '700': '#be2510',
          '800': '#972015',
          '900': '#7a1d14',
          '950': '#420b08',
        },
        'casal': {
          '50': '#edfefc',
          '100': '#d2fbf9',
          '200': '#abf6f3',
          '300': '#72eee9',
          '400': '#31dfdb',
          '500': '#15c5c4',
          '600': '#14a0a6',
          '700': '#178087',
          '800': '#1c676e',
          '900': '#1c575f',
          '950': '#0c3940',
        },
        'facebook': '#3b5999',
        'messenger': '#0084ff',
        'twitter': '#55acee',
        'linkedin': '#0077b5',
        'skype': '#00aff0',
        'dropbox': '#007ee5',
        'wordpress': '#21759b',
        'vimeo': '#1ab7ea',
        'slideshare': '#0077b5',
        'vk': '#4c75a3',
        'tumblr': '#34465d',
        'yahoo': '#410093',
        'google-plus': '#dd4b39',
        'pinterest': '#bd081c',
        'youtube': '#cd201f',
        'stumbleupon': '#eb4924',
        'reddit': '#ff5700',
        'quora': '#b92b27',
        'yelp': '#af0606',
        'weibo': '#df2029',
        'producthunt': '#da552f',
        'hackernews': '#ff6600',
        'soundcloud': '#ff3300',
        'blogger': '#f57d00',
        'whatsapp': '#25d366',
        'wechat': '#09b83e',
        'line': '#00c300',
        'medium': '#02b875',
        'vine': '#00b489',
        'slack': '#3aaf85',
        'instagram': '#e4405f',
        'dribbble': '#ea4c89',
        'flickr': '#ff0084',
        'foursquare': '#f94877',
        'behance': '#131418',
        'snapchat': '#fffc00'
      },
  },
  variants: {},
  plugins: [],
}};
export default config;
