import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun, Palette, Bell, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ onMenuClick }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: colors.bg }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.card,
          height: '50px',
        }}
      >
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.text,
            padding: '4px',
            display: 'none',
            '@media (max-width: 768px)': {
              display: 'flex',
            },
          }}
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '15px', fontWeight: '600', color: colors.text, margin: 0, flex: 1 }}>
          Settings
        </h1>
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            color: colors.textSecondary,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 8px 0' }}>
              Settings
            </h2>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Manage your preferences and system configuration
            </p>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '24px' }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: colors.textSecondary, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Appearance
            </h3>
            <div
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: `0 1px 3px ${colors.shadow}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Palette size={18} color={colors.textSecondary} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: 0 }}>
                    Dark Mode
                  </p>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
                    {theme === 'light' ? 'Light theme' : 'Dark theme'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: theme === 'light' ? '#e5e7eb' : '#404452',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: colors.card,
                    position: 'absolute',
                    top: '2px',
                    left: theme === 'light' ? '2px' : '22px',
                    transition: 'all 0.3s ease',
                  }}
                />
              </button>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '24px' }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: colors.textSecondary, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Notifications
            </h3>
            <div
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                overflow: 'hidden',
                boxShadow: `0 1px 3px ${colors.shadow}`,
              }}
            >
              {/* In-App Notifications */}
              <div
                style={{
                  padding: '16px',
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={18} color={colors.textSecondary} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: 0 }}>
                      In-App Notifications
                    </p>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
                      Receive alerts within the app
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: colors.text,
                  }}
                />
              </div>

              {/* Email Alerts */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={18} color={colors.textSecondary} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: 0 }}>
                      Email Alerts
                    </p>
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '4px 0 0 0' }}>
                      Send critical alerts to email
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: colors.text,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* System Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: colors.textSecondary, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              About
            </h3>
            <div
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                padding: '16px',
                boxShadow: `0 1px 3px ${colors.shadow}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <Info size={18} color={colors.textSecondary} style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '13px', color: colors.text, margin: 0, lineHeight: '1.5' }}>
                    WaterIOT v1.0.0 - A smart water tank monitoring system
                  </p>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '8px 0 0 0' }}>
                    Built with React • Powered by IoT Sensors
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
