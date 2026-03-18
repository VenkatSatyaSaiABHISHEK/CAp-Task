import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const History = ({ onMenuClick }) => {
  const { colors, theme, toggleTheme } = useTheme();

  const historyData = [
    { id: 1, time: '10:45 AM', level: '85%', temp: '28°C', event: 'Tank refilled' },
    { id: 2, time: '10:30 AM', level: '65%', temp: '27°C', event: 'Normal operation' },
    { id: 3, time: '10:15 AM', level: '55%', temp: '27°C', event: 'Water usage detected' },
    { id: 4, time: '10:00 AM', level: '72%', temp: '26°C', event: 'System check passed' },
    { id: 5, time: '09:45 AM', level: '75%', temp: '26°C', event: 'Normal operation' },
  ];

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
          History
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
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '32px' }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: colors.text, margin: '0 0 8px 0' }}>
              Event History
            </h2>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Recent system events and activity log
            </p>
          </motion.div>

          {/* History Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 1px 3px ${colors.shadow}`,
              overflow: 'hidden',
            }}
          >
            {historyData.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  padding: '16px',
                  borderBottom: idx !== historyData.length - 1 ? `1px solid ${colors.border}` : 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9f9f9' : '#1f1f1f'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Clock size={16} color={colors.textSecondary} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: '0 0 4px 0' }}>
                      {item.event}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: colors.textSecondary }}>
                      <span>{item.time}</span>
                      <span>•</span>
                      <span>{item.level}</span>
                      <span>•</span>
                      <span>{item.temp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ textAlign: 'center', marginTop: '24px' }}
          >
            <button
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: colors.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9f9f9' : '#1f1f1f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.card;
              }}
            >
              Load More Events
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default History;
