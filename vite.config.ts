import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Vite dev server middleware to save and load templates locally
const templateServerPlugin = () => ({
  name: 'template-server',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/check-update' && req.method === 'GET') {
        try {
          if (!fs.existsSync(path.join(__dirname, '.git'))) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ updateAvailable: false, reason: 'not_git_repo' }));
            return;
          }
          
          execSync('git fetch origin main', { stdio: 'ignore' });
          const localHash = execSync('git rev-parse HEAD').toString().trim();
          const remoteHash = execSync('git rev-parse origin/main').toString().trim();
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            updateAvailable: localHash !== remoteHash,
            localHash,
            remoteHash
          }));
        } catch (err: any) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ updateAvailable: false, reason: 'error', error: err.message }));
        }
        return;
      }
      
      if (req.url === '/api/trigger-update' && req.method === 'POST') {
        try {
          execSync('git pull', { stdio: 'inherit' });
          try {
            execSync('npm install', { stdio: 'inherit' });
          } catch (npmErr) {
            console.warn('npm install failed but git pull succeeded', npmErr);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      if (req.url === '/api/save-template' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            const { name, content } = JSON.parse(body);
            if (!name || !content) {
              res.statusCode = 400;
              res.end('Missing name or content');
              return;
            }
            
            // Clean filename
            const cleanName = name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim();
            const fileName = cleanName.replace(/\s+/g, '_') + '.xslt';
            const templatesDir = path.resolve(__dirname, 'public/templates');
            
            if (!fs.existsSync(templatesDir)) {
              fs.mkdirSync(templatesDir, { recursive: true });
            }
            
            fs.writeFileSync(path.join(templatesDir, fileName), content, 'utf8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, fileName }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(err.message);
          }
        });
      } else if (req.url === '/api/list-templates' && req.method === 'GET') {
        try {
          const templatesDir = path.resolve(__dirname, 'public/templates');
          if (!fs.existsSync(templatesDir)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
            return;
          }
          const files = fs.readdirSync(templatesDir)
            .filter(file => file.endsWith('.xslt'))
            .map(file => {
              const filePath = path.join(templatesDir, file);
              const content = fs.readFileSync(filePath, 'utf8');
              return {
                name: file.replace('.xslt', '').replace(/_/g, ' '),
                fileName: file,
                content
              };
            });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(err.message);
        }
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), templateServerPlugin()],
  server: {
    open: true
  }
})


