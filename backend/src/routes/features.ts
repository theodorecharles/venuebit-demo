import { Router, Request, Response } from 'express';
import { getFeatureDecisions, getHomescreenDecision, getAppThemeDecision } from '../services/optimizelyService';

const router = Router();

router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { operating_system } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const os = typeof operating_system === 'string' ? operating_system : undefined;
    const ticketDecisions = getFeatureDecisions(userId, os);
    const homescreenDecision = getHomescreenDecision(userId, os);
    const appThemeDecision = getAppThemeDecision(userId, os);

    // Return structured format for iOS app with all features
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
});

export default router;
