/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './*.html', './*/*.html'],
  darkMode: ['class', '[data-theme="phosphor"]'],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: '#F5F2EB',
          subtle: '#EDE8DE',
          carbon: '#1A1A1C',
          pencil: '#D1CBBF',
          margin: '#8C857B',
          red: '#942A27',
          blue: '#1D4ED8',
          green: '#2D5A27',
        },
        terminal: {
          bg: '#0F0F10',
          subtle: '#18181A',
          fg: '#E2E0D8',
          muted: '#6B7280',
          wire: '#28282C',
          wireHover: '#3F3F46',
          amber: '#D97706',
          phosphor: '#059669',
          crimson: '#DC2626',
          cyan: '#0284C7',
        }
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"IBM Plex Mono"', '"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['Newsreader', '"EB Garamond"', 'Cardo', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        typewriter: '0.08em',
        expanded: '0.12em',
      },
      maxWidth: {
        prose: '68ch',
      }
    },
  },
  plugins: [],
};

