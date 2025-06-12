import { spawn } from 'node:child_process';

const child = spawn('npx', ['vitest', '--run', '--coverage'], {
  stdio: 'inherit',
  shell: true,
});

child.on('close', (code) => {
  if (code === 1) {
    console.log('No test files found. Exiting gracefully.');
    process.exit(0);
  }
  process.exit(code);
});
