import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://jyotiraj-code.github.io',
  base: process.env.BASE_PATH || (isGitHubActions && !process.env.CUSTOM_DOMAIN ? '/JyotirajWebpage' : '/'),
  trailingSlash: 'always',
  integrations: [tailwind({
    applyBaseStyles: false,
  })],
  build: {
    format: 'directory'
  }
});

