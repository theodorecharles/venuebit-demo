import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../_lib/utils/cors';
import { ensureOptimizelyInitialized } from '../_lib/initOptimizely';
import { getFeatureDecisions, getHomescreenDecision, getAppThemeDecision } from '../_lib/services/optimizelyService';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  ensureOptimizelyInitialized();

  try {
    const { userId, operating_system } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const os = typeof operating_system === 'string' ? operating_system : undefined;
    const ticketDecisions = getFeatureDecisions(userId as string, os);
    const homescreenDecision = getHomescreenDecision(userId as string, os);
    const appThemeDecision = getAppThemeDecision(userId as string, os);

    return res.json({
      success: true,
      data: {
        userId,
        features: {
          ticket_experience: {
            enabled: ticketDecisions.ticket_experience,
            variationKey: ticketDecisions.variation_key,
            variables: {
              show_recommendations: ticketDecisions.show_recommendations,
              checkout_layout: ticketDecisions.checkout_layout,
              show_urgency_banner: ticketDecisions.show_urgency_banner
            }
          },
          venuebit_homescreen: {
            enabled: homescreenDecision.enabled,
            variationKey: homescreenDecision.variationKey,
            variables: {
              module_count: homescreenDecision.modules.length
            }
          },
          app_theme: {
            enabled: appThemeDecision.enabled,
            variationKey: appThemeDecision.variationKey,
            variables: {
              theme: appThemeDecision.theme
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching feature decisions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch feature decisions'
    });
  }
}
