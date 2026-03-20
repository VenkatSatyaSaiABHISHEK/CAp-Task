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
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth <= 768 && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 35,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}
      {/* Sidebar */}
      <div
        style={{
          width: '260px',
          height: '100%',
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          position: 'relative',
          flexShrink: 0,
          overflow: 'hidden',
          // Mobile responsive: hide on mobile by default
          ...(window.innerWidth <= 768 && !isOpen && { display: 'none' })
        }}
        className={isOpen ? 'sidebar open' : 'sidebar'}
      >

        {/* Header */}
      <div
        style={{
          padding: '16px 12px',
          borderBottom: `1px solid ${sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px',
        }}
      >
        {/* Mobile Close Button */}
        {window.innerWidth <= 768 && (
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: colors.text,
              transition: 'all 0.2s ease',
              minHeight: '32px',
              minWidth: '32px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} strokeWidth={2} />
          </button>
        )}
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
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth <= 768) {
                    onClose();
                  }
                }}
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
