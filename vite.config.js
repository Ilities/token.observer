import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

const PRERENDER_ROUTES = [
  '/',
  '/compare',
  '/history',
  '/models',
  '/about',
];

const generateRedirects = () => ({
  name: 'generate-redirects',
  closeBundle: async () => {
    const redirectsContent = "/*    /index.html   200\n";
    const distPath = path.resolve(process.cwd(), 'dist', '_redirects');
    fs.writeFileSync(distPath, redirectsContent);
    console.log('Created _redirects file');
  }
});

const generate404Page = () => ({
  name: 'generate-404-page',
  closeBundle: async () => {
    const notFoundContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The requested page could not be found.</p>
  <a href="/">Go to homepage</a>
</body>
</html>`;
    const distPath = path.resolve(process.cwd(), 'dist', '404.html');
    fs.writeFileSync(distPath, notFoundContent);
    console.log('Created 404.html');
  }
});

const generateStaticHtml = () => ({
  name: 'generate-static-html',
  closeBundle: async () => {
    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.error('index.html not found, skipping SSG');
      return;
    }
    
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    
    for (const route of PRERENDER_ROUTES) {
      if (route === '/') continue;
      
      const routeName = route.slice(1);
      const outputPath = path.join(distPath, `${routeName}.html`);
      
      fs.writeFileSync(outputPath, indexHtml);
      console.log(`Created static HTML: ${routeName}.html`);
    }
    
    console.log('SSG: Generated static HTML files for all routes');
  }
});

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    generateRedirects(),
    generate404Page(),
    generateStaticHtml(),
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "/",
});
