import { Server } from 'http';
import app from './app';
import { prisma } from './app/lib/prisma';
import { env } from './app/config/env';

let server: Server;

async function main() {
  try {
    // Prisma connects automatically on first query, but we can explicitly connect
    await prisma.$connect();
    console.log('🗃️  Database connected successfully');

    server = app.listen(env.port, () => {
      console.log(`🚀 Server is listening on port ${env.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

// Graceful shutdown handlers
process.on('unhandledRejection', async (err) => {
  console.log(`😈 Unhandled Rejection detected, shutting down...`, err);
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    await prisma.$disconnect();
    process.exit(1);
  }
});

process.on('uncaughtException', async (err) => {
  console.log(`😈 Uncaught Exception detected, shutting down...`, err);
  await prisma.$disconnect();
  process.exit(1);
});

// Handle SIGTERM (e.g., from Docker or cloud platforms)
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('👋 Server closed');
      process.exit(0);
    });
  }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('👋 Server closed');
      process.exit(0);
    });
  }
});