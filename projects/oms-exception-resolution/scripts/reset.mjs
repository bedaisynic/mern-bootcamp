import { rm } from 'node:fs/promises';
await rm(new URL('../.demo', import.meta.url), { recursive: true, force: true });
console.log('Local workspace state cleared. Restart the services to load the initial cases.');
