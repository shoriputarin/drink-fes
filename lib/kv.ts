// lib/kv.ts
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default kv;