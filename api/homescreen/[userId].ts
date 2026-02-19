import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../_lib/initOptimizely';
import { getHomescreenDecision } from '../_lib/services/optimizelyService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { userId, operating_system } = req.query;

    console.log(`[Homescreen] Request for user ${userId}, operating_system=${operating_system}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const os = typeof operating_system === 'string' ? operating_system : undefined;
    const decision = getHomescreenDecision(userId as string, os);

    return res.json({
      success: true,
      data: decision.modules,
      variationKey: decision.variationKey,
      enabled: decision.enabled
    });
  } catch (error) {
    console.error('Error fetching homescreen configuration:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch homescreen configuration'
    });
  }
}
