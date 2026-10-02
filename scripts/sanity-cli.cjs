// Load dotenv explicitly so its configuration argument never becomes a CLI output directory.
require('dotenv').config({ path: '.env.local', quiet: true });
const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');
const result = spawnSync(process.execPath, [resolve('node_modules/sanity/bin/sanity'), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    XDG_CONFIG_HOME: resolve('.sanity/cli-config'),
    NO_UPDATE_NOTIFIER: '1',
  },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
