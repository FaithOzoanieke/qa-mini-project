// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite';
// // import tailwindcss from '@tailwindcss/vite';

// // https://vite.dev/config/
// export default defineConfig(async () => {
//   const { default: tailwindcss } = await import('@tailwindcss/vite');
  
//   return {
//   plugins: [
//     react(),
//     tailwindcss()
//   ],
// };

// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  // Dynamically import the ESM-only Tailwind plugin
  const { default: tailwindPlugin } = await import('@tailwindcss/vite');

  return {
    plugins: [
      react(),
      tailwindPlugin(),
    ],

  };
});
