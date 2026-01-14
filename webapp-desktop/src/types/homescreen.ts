import { EventCategory } from './event';

export type HomescreenModuleType =
  | 'hero_carousel'
  | 'categories'
  | 'trending_now'
  | 'this_weekend'
  | 'all_events';

export type SortOption = 'date_asc' | 'date_desc' | 'alphabetical_asc' | 'trending_desc';

export interface HomescreenModuleConfig {
  categories?: EventCategory[];
  sortBy?: SortOption;
  length?: number;
}

export interface HomescreenModule {
  module: HomescreenModuleType;
  config: HomescreenModuleConfig;
}

export interface HomescreenResponse {
  success: boolean;
  data: HomescreenModule[];
  variationKey?: string;
  enabled?: boolean;
}
