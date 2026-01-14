import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useAppStore } from '../../store/appStore';

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

export const Sidebar: React.FC = () => {
  const userId = useUserStore((state) => state.userId);
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((state) => state.setSidebarCollapsed);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-theme-surface border-r border-theme flex flex-col transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-theme flex items-center justify-between">
        {!sidebarCollapsed && (
          <h1 className="logo-font text-2xl bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">
            VenueBit
          </h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-theme-surface-secondary transition-colors"
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${
                sidebarCollapsed ? 'justify-center px-2' : ''
              }`
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="text-xl">{item.icon}</span>
            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User ID Badge */}
      <div className="p-4 border-t border-theme">
        {sidebarCollapsed ? (
          <div
            className="w-10 h-10 rounded-full bg-theme-surface-secondary flex items-center justify-center text-xs font-mono cursor-help"
            title={userId}
          >
            👤
          </div>
        ) : (
          <div className="bg-theme-surface-secondary rounded-lg p-3">
            <p className="text-xs text-text-tertiary mb-1">User ID</p>
            <p className="text-xs font-mono text-text-secondary truncate">{userId}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
