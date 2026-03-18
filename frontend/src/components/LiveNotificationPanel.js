import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaClock } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/LiveNotificationPanel.css';

const LiveNotificationPanel = ({ messages = [] }) => {
  const { colors } = useTheme();
  const messagesEndRef = useRef(null);
  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    setDisplayMessages(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  const getMessageIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={16} />;
      case 'warning':
        return <FaExclamationTriangle size={16} />;
      case 'info':
        return <FaInfoCircle size={16} />;
      default:
        return <FaInfoCircle size={16} />;
    }
  };

  const getMessageStyle = (type) => {
    const baseStyle = {
      backgroundColor: colors.card,
      borderLeft: `3px solid`,
    };

    const typeStyles = {
      success: {
        ...baseStyle,
        borderLeftColor: colors.success,
        backgroundColor: `${colors.success}08`,
      },
      warning: {
        ...baseStyle,
        borderLeftColor: colors.warning,
        backgroundColor: `${colors.warning}08`,
      },
      info: {
        ...baseStyle,
        borderLeftColor: colors.accent,
        backgroundColor: `${colors.accent}08`,
      },
      error: {
        ...baseStyle,
        borderLeftColor: colors.error,
        backgroundColor: `${colors.error}08`,
      },
    };

    return typeStyles[type] || typeStyles.info;
  };

  const containerStyle = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    boxShadow: `0 1px 3px ${colors.shadow}`,
  };

  const titleStyle = {
    color: colors.text,
  };

  const subtitleStyle = {
    color: colors.textSecondary,
  };

  const messageTextStyle = {
    color: colors.text,
  };

  const timestampStyle = {
    color: colors.textSecondary,
  };

  return (
    <div className="live-notification-panel" style={containerStyle}>
      {/* Header */}
      <div className="panel-header">
        <div className="panel-title" style={titleStyle}>
          Live System Status
        </div>
        <div className="panel-subtitle" style={subtitleStyle}>
          Real-time monitoring
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="panel-animation">
        <DotLottieReact
          src="https://lottie.host/74eff911-8885-454c-a103-f46a4f08349f/JIQQLJQvpz.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {displayMessages.length === 0 ? (
          <div className="empty-message">
            <p style={subtitleStyle}>Waiting for updates...</p>
            <p style={{ ...subtitleStyle, fontSize: '12px', marginTop: '4px' }}>
              System messages will appear here
            </p>
          </div>
        ) : (
          displayMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`message message-${msg.type}`}
              style={getMessageStyle(msg.type)}
            >
              <div className="message-icon" style={{ color: colors.text }}>
                {getMessageIcon(msg.type)}
              </div>
              <div className="message-content">
                <div className="message-text" style={messageTextStyle}>
                  {msg.text}
                </div>
                <div className="message-timestamp" style={timestampStyle}>
                  <FaClock size={11} style={{ marginRight: '4px' }} />
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default LiveNotificationPanel;
