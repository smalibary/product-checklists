// Types for vite-plugin.mjs, so a TypeScript vite.config can import it.
import type { Plugin } from 'vite';

export default function inspect(options?: { projectDir?: string }): Plugin;
