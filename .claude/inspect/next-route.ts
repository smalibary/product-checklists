// Inspect mode for a Next.js app, development only. Copy this file from .claude/inspect/ to app/api/inspect/route.ts
// (fix the import path if your app folder sits elsewhere), then add to app/layout.tsx inside <body>:
//   {process.env.NODE_ENV === 'development' && <script src="/api/inspect" defer />}
// Screenshots need html-to-image in the app: pnpm add -D html-to-image
// In production both handlers answer 404, so nothing is exposed.
import { savePick, devScript, shotLib } from '../../../.claude/inspect/save-pick.mjs';

const dev = process.env.NODE_ENV === 'development';
const js = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/javascript' } });

export async function GET(req: Request) {
  if (!dev) return new Response('Not found', { status: 404 });
  if (new URL(req.url).searchParams.has('lib')) {
    try { return js(shotLib(process.cwd())); }
    catch (e) { return new Response('html-to-image not installed: ' + (e as Error).message, { status: 404 }); }
  }
  return js(devScript('/api/inspect', { projectDir: process.cwd(), lib: '/api/inspect?lib' }));
}

export async function POST(req: Request) {
  if (!dev) return new Response('Not found', { status: 404 });
  try { return Response.json(savePick(process.cwd(), await req.text())); }
  catch (e) { return Response.json({ error: (e as Error).message }, { status: 400 }); }
}
