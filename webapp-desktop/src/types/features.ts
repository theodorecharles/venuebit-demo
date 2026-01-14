export interface TicketExperienceVariables {
  show_recommendations: boolean;
  checkout_layout: string;
  show_urgency_banner: boolean;
}

export interface TicketExperienceFeature {
  enabled: boolean;
  variationKey: string;
  variables: TicketExperienceVariables;
}

export type AppTheme = 'off' | 'black' | 'dark' | 'beige' | 'light';

export interface AppThemeFeature {
  enabled: boolean;
  variationKey: AppTheme;
}

export interface FeaturesResponse {
  success: boolean;
  data: {
    userId: string;
    features: {
      ticket_experience: TicketExperienceFeature;
      app_theme: AppThemeFeature;
      venuebit_homescreen?: {
        enabled: boolean;
        variationKey: string;
        variables: {
          module_count: number;
        };
      };
    };
  };
}
