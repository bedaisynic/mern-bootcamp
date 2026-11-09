import { rm } from 'node:fs/promises';
await rm(new URL('../.demo', import.meta.url), { recursive: true, force: true });
console.log('Demo state cleared. Restart the services to reseed EX-2048.');
