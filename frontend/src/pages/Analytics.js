import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Analytics = ({ onMenuClick }) => {
  const { colors, theme, toggleTheme } = useTheme();

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
          Analytics
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
              Analytics & Trends
            </h2>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
              Water usage patterns and historical trends
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}
          >
            {[
              { label: 'Avg Consumption', value: '245L' },
              { label: 'Peak Usage', value: '89%' },
              { label: 'Total Stored', value: '2,480L' },
              { label: 'Data Points', value: '15,340' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`,
                  padding: '16px',
                  boxShadow: `0 1px 3px ${colors.shadow}`,
                }}
              >
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '600' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: colors.text, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              padding: '28px 24px',
              boxShadow: `0 1px 3px ${colors.shadow}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: '0 0 8px 0' }}>
              Detailed Analytics Coming Soon
            </h3>
            <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0 }}>
              Charts, graphs, and advanced analytics will be available soon.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
