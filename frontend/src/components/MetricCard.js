import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AnimatedNumber from './AnimatedNumber';
import '../styles/MetricCard.css';

const MetricCard = ({ icon: Icon, label, value, unit, description, status = 'normal' }) => {
  const { colors } = useTheme();

  const statusColors = {
    normal: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  const cardStyle = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
  };

  const iconStyle = {
    color: statusColors[status],
  };

  const valueStyle = {
    color: colors.text,
  };

  const labelStyle = {
    color: colors.textSecondary,
  };

  return (
    <motion.div
      className="metric-card"
      style={cardStyle}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="metric-header">
        <div className="metric-icon" style={iconStyle}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className="metric-label" style={labelStyle}>
          {label}
        </div>
      </div>
      
      <div className="metric-value" style={valueStyle}>
        <AnimatedNumber
          value={value || 0}
          duration={0.6}
          decimals={value > 100 ? 1 : 2}
          suffix={unit ? ` ${unit}` : ''}
        />
      </div>
      
      {description && (
        <div className="metric-description" style={labelStyle}>
          {description}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
