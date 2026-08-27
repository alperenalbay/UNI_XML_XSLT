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

          // Uzak depodaki tüm branch'leri getir ve aktif dalın izlenen
          // (upstream) remote dalı ile karşılaştır. Böylece hangi branch'te
          // olunursa olunsun doğru sürüm karşılaştırması yapılır.
          execSync('git fetch origin', { stdio: 'ignore' });
          const localHash = execSync('git rev-parse HEAD').toString().trim();
          const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

          let remoteHash: string;
          try {
            remoteHash = execSync(`git rev-parse @{u}`).toString().trim();
          } catch (upstreamErr: any) {
            // İzlenen uzak dal yoksa (ör. yeni dal), remote'u dal adıyla varsay.
            remoteHash = execSync(
              `git rev-parse origin/${branch} 2>nul || git rev-parse origin/main`
            )
              .toString()
              .trim()
              .split(/\r?\n/)
              .pop() || localHash;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              updateAvailable: localHash !== remoteHash,
              localHash,
              remoteHash,
              branch
            })
          );
        } catch (err: any) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ updateAvailable: false, reason: 'error', error: err.message }));
        }
        return;
      }

      if (req.url === '/api/trigger-update' && req.method === 'POST') {
        try {
          // Yalnızca doğru branch'i değil, remote'u da güncel tut.
          execSync('git fetch origin', { stdio: 'ignore' });
          const beforeHash = execSync('git rev-parse HEAD').toString().trim();
          execSync('git pull', { stdio: 'inherit' });
          const afterHash = execSync('git rev-parse HEAD').toString().trim();
          const changed = beforeHash !== afterHash;
          try {
            if (changed) {
              execSync('npm install', { stdio: 'inherit' });
            }
          } catch (npmErr) {
            console.warn('npm install failed but git pull succeeded', npmErr);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, changed, beforeHash, afterHash }));
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
    open: false
  }
})


