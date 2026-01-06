import { useFeatureFlagContext } from '../context/FeatureFlagContext';

export const useFeatureFlag = () => {
  return useFeatureFlagContext();
};
