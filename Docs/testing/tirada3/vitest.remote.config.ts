import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({
  resolve: { alias: { '@': resolve(process.cwd(),'src') } },
  test: { environment:'node', include:['Docs/testing/tirada3/remote.integration.ts'],
    testTimeout:60000, hookTimeout:60000 },
});
