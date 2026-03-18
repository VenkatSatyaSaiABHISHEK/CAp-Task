import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, History, Settings, Home, X, FileText, Brain } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { colors, theme } = useTheme();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Brain, label: 'Prediction', path: '/prediction' },
    { icon: History, label: 'History', path: '/history' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarBg = theme === 'day' ? '#ffffff' : '#1a1a1a';
  const sidebarBorder = theme === 'day' ? '#e5e7eb' : '#2d2d2d';
  const activeBg = theme === 'day' ? '#f3f4f6' : '#2d2d2d';
  const hoverBg = theme === 'day' ? '#f9fafb' : '#1f1f1f';

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          position: 'relative',
          flexShrink: 0,
        }}
      >

        {/* Header */}
      <div
        style={{
          padding: '16px 12px',
          borderBottom: `1px solid ${sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: colors.textSecondary,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: 'fit-content',
          }}
        >
          KIET
        </p>
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: colors.text,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Dashboard
        </h2>
      </div>

      {/* Navigation Items */}
      <nav
        style={{
          flex: 1,
          padding: '6px 4px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: active ? activeBg : 'transparent',
                    transition: 'all 0.25s ease',
                    color: active ? colors.text : colors.textSecondary,
                    fontWeight: active ? '600' : '500',
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = colors.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.textSecondary;
                    }
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'inherit',
                      color: 'inherit',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${sidebarBorder}`,
            fontSize: '12px',
            color: colors.textSecondary,
          }}
        >
          <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: '500' }}>
            Status:{' '}
            <span style={{ color: colors.success, fontWeight: '600' }}>● Live</span>
          </div>
          <div style={{ fontSize: '11px' }}>
            Last sync:{' '}
            <span style={{ color: colors.text, fontSize: '11px', fontWeight: '500' }}>
              Just now
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
