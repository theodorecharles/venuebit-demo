import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

interface NavItem {
  to: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: '🏠', label: 'Discover' },
  { to: '/search', icon: '🔍', label: 'Search' },
  { to: '/tickets', icon: '🎟️', label: 'My Tickets' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const itemCount = cart?.items.reduce((sum, item) => sum + item.seats.length, 0) || 0;

  return (
    <header className="h-16 bg-theme-surface border-b border-theme flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left side - Logo */}
      <button
        onClick={() => navigate('/')}
        className="logo-font text-2xl bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
      >
        VenueBit
      </button>

      {/* Center - Page Title (optional) */}
      {title && (
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        </div>
      )}

      {/* Right side - Navigation and Cart */}
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-theme-surface-secondary hover:text-text-primary'
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Cart indicator */}
        {cart && itemCount > 0 && (
          <button
            onClick={() => navigate(`/checkout?cartId=${cart.id}`)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            <span>🛒</span>
            <span className="text-sm font-medium">{itemCount}</span>
          </button>
        )}
      </div>
    </header>
  );
};
