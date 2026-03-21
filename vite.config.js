import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Plugin to generate _redirects file for GitHub Pages
const generateRedirects = () => ({
  name: 'generate-redirects',
  closeBundle: async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    // Write _redirects file to dist directory after build
    const redirectsContent = "/*    /index.html   200\n";
    const distPath = path.resolve(process.cwd(), 'dist', '_redirects');
    fs.writeFileSync(distPath, redirectsContent);
  }
});

// Plugin to generate 404.html for GitHub Pages fallback
const generate404Page = () => ({
  name: 'generate-404-page',
  closeBundle: async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    // Write 404.html to dist directory after build
    const notFoundContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <script>
    // Redirect all routes to index.html to enable client-side routing
    // Store the original URL in sessionStorage so the app can handle it
    sessionStorage.setItem('gh_redirect_uri', window.location.pathname + window.location.search + window.location.hash);
    window.location.href = '/';
  </script>
</head>
<body>
  <noscript>
    <h1>This application requires JavaScript to be enabled.</h1>
  </noscript>
</body>
</html>`;
    const distPath = path.resolve(process.cwd(), 'dist', '404.html');
    fs.writeFileSync(distPath, notFoundContent);
  }
});

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    react(), 
    tailwindcss(),
    generateRedirects(),
    generate404Page()
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "/",
});
