import type { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'cookie', 'Authorization'],
  credentials: true,
};
