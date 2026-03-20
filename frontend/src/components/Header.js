import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onMenuClick, isConnected }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const headerBg = theme === 'day' ? '#ffffff' : '#1a1a1a';
  const headerBorder = theme === 'day' ? '#e5e7eb' : '#2d2d2d';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        borderBottom: `1px solid ${headerBorder}`,
        backgroundColor: headerBg,
        height: '56px',
        minHeight: '56px',
        flexShrink: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.text,
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            display: isMobile ? 'flex' : 'none',
            fontSize: '18px',
            minWidth: '44px',
            minHeight: '44px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'day' ? '#f0f0f0' : '#2d2d2d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="https://www.kietgroup.info/Images/KIETGroup.jpg"
            alt="KIET Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Status Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: theme === 'day' ? '#f3f4f6' : '#2d2d2d',
            fontSize: '12px',
            fontWeight: '500',
            color: isConnected ? colors.success : colors.error,
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isConnected ? colors.success : colors.error,
            }}
          />
          {isConnected ? 'Connected' : 'Offline'}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 8px',
            color: colors.textSecondary,
            transition: 'all 0.2s ease',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'day' ? '#f0f0f0' : '#2d2d2d';
            e.currentTarget.style.color = colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.textSecondary;
          }}
        >
          {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 8px',
            color: colors.textSecondary,
            transition: 'all 0.2s ease',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'day' ? '#f0f0f0' : '#2d2d2d';
            e.currentTarget.style.color = colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.textSecondary;
          }}
        >
          <Bell size={18} />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              backgroundColor: colors.error,
              borderRadius: '50%',
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Header;
