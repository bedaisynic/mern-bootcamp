import app from './app.js';
import { initializeDatabase } from './db/seed.js';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
