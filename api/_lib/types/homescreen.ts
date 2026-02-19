export type ModuleType = 'hero_carousel' | 'categories' | 'trending_now' | 'this_weekend' | 'all_events';
export type SortBy = 'date_asc' | 'date_desc' | 'alphabetical_asc' | 'trending_desc';
export type CategoryType = 'concerts' | 'sports' | 'theater' | 'comedy';

export interface ModuleConfig {
  categories?: CategoryType[];
  sortBy?: SortBy;
  length?: number;
}

export interface HomescreenModule {
  module: ModuleType;
  config: ModuleConfig;
}

export type HomescreenConfiguration = HomescreenModule[];

export const DEFAULT_HOMESCREEN_CONFIG: HomescreenConfiguration = [
  {
    module: 'hero_carousel',
    config: {
      categories: ['concerts', 'sports', 'theater', 'comedy'],
      length: 10
    }
  },
  {
    module: 'categories',
    config: {
      categories: ['concerts', 'sports', 'theater', 'comedy'],
    }
  },
  {
    module: 'trending_now',
    config: {
      categories: ['concerts', 'sports', 'theater', 'comedy'],
      length: 10
    }
  },
  {
    module: 'this_weekend',
    config: {
      categories: ['concerts', 'sports', 'theater', 'comedy'],
      length: 10
    }
  },
  {
    module: 'all_events',
    config: {
      sortBy: 'date_asc',
      categories: ['concerts', 'sports', 'theater', 'comedy'],
      length: 10
    }
  }
];
