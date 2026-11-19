// Inspect mode for a Vite app, development only (Vite's "serve"; never in a build).
// In vite.config: import inspect from './.claude/inspect/vite-plugin.mjs'; plugins: [react(), inspect()]
// Screenshots need html-to-image in the app: pnpm add -D html-to-image
import { savePick, devScript, shotLib, MAX_BODY } from './save-pick.mjs';

export default function inspect({ projectDir = process.cwd() } = {}) {
  return {
    name: 'inspect-mode',
    apply: 'serve',
    configureServer(server) {
      const js = (res, text) => { res.setHeader('Content-Type', 'text/javascript'); res.end(text); };
      server.middlewares.use('/__inspect/inspect.js', (req, res) => {
        js(res, devScript('/__inspect/pick', { projectDir, lib: '/__inspect/html-to-image.js' }));
      });
      server.middlewares.use('/__inspect/html-to-image.js', (req, res) => {
        try { js(res, shotLib(server.config.root)); }
        catch (e) { res.statusCode = 404; res.end('html-to-image not installed in the app: ' + e.message); }
      });
      server.middlewares.use('/__inspect/pick', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
        let body = '', size = 0;
        req.on('data', c => { size += c.length; if (size <= MAX_BODY) body += c; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            if (size > MAX_BODY) throw new Error('pick too large');
            res.end(JSON.stringify(savePick(projectDir, body)));
          } catch (e) { res.statusCode = 400; res.end(JSON.stringify({ error: e.message })); }
        });
      });
    },
    transformIndexHtml() {
      return [{ tag: 'script', attrs: { src: '/__inspect/inspect.js' }, injectTo: 'body' }];
    },
  };
}
