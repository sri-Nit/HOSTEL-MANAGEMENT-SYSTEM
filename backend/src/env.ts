import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try common .env locations
const envPaths = [
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '.env')
];

const envPath = envPaths.find(p => fs.existsSync(p));

dotenv.config(envPath ? { path: envPath } : undefined);

console.log('📦 ENV LOADED FROM:', envPath);
console.log('SUPABASE_URL:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', !!process.env.SUPABASE_KEY);