import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/utils/cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  res.json({
    success: true,
    message: 'VenueBit API is running',
    timestamp: new Date().toISOString()
  });
}
