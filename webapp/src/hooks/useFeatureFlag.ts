import { useDecision } from '@optimizely/react-sdk';
import { FEATURE_FLAGS, VARIATIONS, VariationType } from '../optimizely/features';

export const useFeatureFlag = () => {
  const [decision] = useDecision(FEATURE_FLAGS.TICKET_EXPERIENCE);

  const variation = (decision?.variationKey as VariationType) || VARIATIONS.CONTROL;
  const isEnhanced = variation === VARIATIONS.ENHANCED;
  const isControl = variation === VARIATIONS.CONTROL;

  return {
    variation,
    isEnhanced,
    isControl,
    enabled: decision?.enabled || false,
  };
};
