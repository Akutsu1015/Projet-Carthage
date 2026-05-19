const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');
console.log('--- Starting Game Matcher Dev Environment ---');

// Start Next.js directly via internal bin (bypassing npm/shell)
const nextPath = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');
const next = spawn('node', [nextPath, 'dev'], {
  stdio: 'inherit',
  cwd: rootDir
});

// Start Battle Server
const battleServer = spawn('node', ['battle-server.js'], {
  stdio: 'inherit',
  cwd: rootDir
});

function handleExit(code) {
  next.kill();
  battleServer.kill();
  process.exit(code);
}

process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));
next.on('close', handleExit);
battleServer.on('close', handleExit);
