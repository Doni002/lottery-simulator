const { spawnSync } = require('node:child_process');
const { existsSync, copyFileSync } = require('node:fs');
const path = require('node:path');

const rootDir = process.cwd();
const backendDir = path.join(rootDir, 'backend');
const backendEnvExample = path.join(backendDir, '.env.example');
const backendEnv = path.join(backendDir, '.env');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(command, args, cwd = rootDir) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\n[setup] Installing root dependencies...');
run(npmCmd, ['install']);

console.log('\n[setup] Installing frontend dependencies...');
run(npmCmd, ['install', '--prefix', 'frontend']);

console.log('\n[setup] Installing backend dependencies...');
run(npmCmd, ['install', '--prefix', 'backend']);

if (!existsSync(backendEnvExample)) {
  console.error('\n[setup] Missing backend/.env.example.');
  process.exit(1);
}

if (!existsSync(backendEnv)) {
  copyFileSync(backendEnvExample, backendEnv);
  console.log('\n[setup] Created backend/.env from backend/.env.example.');
} else {
  console.log('\n[setup] backend/.env already exists. Keeping existing file.');
}

console.log('\n[setup] Running Prisma migrations...');
run(npxCmd, ['prisma', 'migrate', 'dev'], backendDir);

console.log('\n[setup] Generating Prisma client...');
run(npxCmd, ['prisma', 'generate'], backendDir);

console.log('\n[setup] Complete. Run `npm run dev` to start the app.');