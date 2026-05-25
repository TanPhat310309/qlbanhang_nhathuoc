import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vite-plugin-save-json',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/api/save/') && req.method === 'POST') {
            const fileName = req.url.split('/api/save/')[1]; 
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const filePath = path.resolve(process.cwd(), 'public', `${fileName}.json`);
                const jsonData = JSON.parse(body); 
                const prettyJson = JSON.stringify(jsonData, null, 2);
                fs.writeFileSync(filePath, prettyJson, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ]
})