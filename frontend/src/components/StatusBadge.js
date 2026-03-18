import React from 'react';
import { FaCircle, FaClock, FaWifi } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/StatusBadge.css';

const StatusBadge = ({ isConnected, lastSync, backendStatus = 'operational' }) => {
  const { colors } = useTheme();

  const statusColor = isConnected ? colors.success : colors.error;
  const statusText = isConnected ? 'Connected' : 'Disconnected';

  const containerStyle = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    boxShadow: `0 1px 3px ${colors.shadow}`,
  };

  const labelStyle = {
    color: colors.textSecondary,
  };

  const statusLabelStyle = {
    color: colors.text,
    fontWeight: '600',
  };

  const syncTimeStyle = {
    color: colors.textSecondary,
    fontSize: '12px',
  };

  return (
    <div className="status-badge" style={containerStyle}>
      <div className="status-main">
        <div className="status-indicator">
          <FaCircle size={10} style={{ color: statusColor }} className="pulse" />
          <span style={statusLabelStyle}>{statusText}</span>
        </div>
        <span style={labelStyle}>to Backend</span>
      </div>

      <div className="status-details">
        <div className="status-item">
          <FaWifi size={12} style={{ color: colors.accent }} />
          <span style={syncTimeStyle}>Backend: {backendStatus}</span>
        </div>
        <div className="status-item">
          <FaClock size={12} style={{ color: colors.accent }} />
          <span style={syncTimeStyle}>Last sync: {lastSync}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
