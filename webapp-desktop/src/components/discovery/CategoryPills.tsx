import React from 'react';
import { Link } from 'react-router-dom';
import { EventCategory } from '../../types/event';
import { CATEGORY_DISPLAY_NAMES, CATEGORY_EMOJIS, CATEGORIES } from '../../utils/constants';

interface CategoryPillsProps {
  categories?: EventCategory[];
  selectedCategory?: EventCategory | null;
  onSelect?: (category: EventCategory | null) => void;
  linkToSearch?: boolean;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories = CATEGORIES,
  selectedCategory,
  onSelect,
  linkToSearch = false,
}) => {
  const renderPill = (category: EventCategory) => {
    const isSelected = selectedCategory === category;
    const baseClasses = `flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
      isSelected
        ? 'bg-primary border-primary text-white'
        : 'bg-theme-surface border-theme text-text-secondary hover:border-primary hover:text-text-primary'
    }`;

    const content = (
      <>
        <span>{CATEGORY_EMOJIS[category]}</span>
        <span className="font-medium">{CATEGORY_DISPLAY_NAMES[category]}</span>
      </>
    );

    if (linkToSearch) {
      return (
        <Link
          key={category}
          to={`/search?category=${category}`}
          className={baseClasses}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={category}
        onClick={() => onSelect?.(isSelected ? null : category)}
        className={baseClasses}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map(renderPill)}
    </div>
  );
};
