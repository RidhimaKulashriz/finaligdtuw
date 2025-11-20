#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to backend directory and start the backend
const backendPath = join(__dirname, 'backend');
const child = spawn('npm', ['run', 'build'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    // Build succeeded, now start the server
    const server = spawn('npm', ['start'], {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  } else {
    console.error('Build failed');
    process.exit(1);
  }
});

child.on('error', (err) => {
  console.error('Failed to build:', err);
  process.exit(1);
});
