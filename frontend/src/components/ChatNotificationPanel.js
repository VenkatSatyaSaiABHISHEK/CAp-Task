import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ChatNotificationPanel = ({ messages = [] }) => {
  const { colors, theme } = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageStyle = (type) => {
    const baseStyle = {
      maxWidth: '85%',
      padding: '10px 14px',
      borderRadius: '12px',
      fontSize: '13px',
      lineHeight: '1.4',
      wordWrap: 'break-word',
      transition: 'all 0.2s ease',
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: theme === 'day' ? '#f0fdf4' : '#064e3b',
          color: theme === 'day' ? '#15803d' : '#86efac',
          border: `1px solid ${theme === 'day' ? '#dcfce7' : '#166534'}`,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: theme === 'day' ? '#fef2f2' : '#7c2d12',
          color: theme === 'day' ? '#b91c1c' : '#fca5a5',
          border: `1px solid ${theme === 'day' ? '#fee2e2' : '#92400e'}`,
        };
      case 'info':
      default:
        return {
          ...baseStyle,
          backgroundColor: theme === 'day' ? '#f0f9ff' : '#082f49',
          color: theme === 'day' ? '#0369a1' : '#7dd3fc',
          border: `1px solid ${theme === 'day' ? '#e0f2fe' : '#0c4a6e'}`,
        };
    }
  };

  const getTimeString = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const panelHeaderBg = theme === 'day' ? '#f7f8f9' : '#141414';
  const panelBg = colors.card;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: panelBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: `0 1px 2px ${colors.shadow}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: panelHeaderBg,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: '600',
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Activity
        </h3>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: panelBg,
        }}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: colors.textSecondary,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💧</div>
              <p style={{ fontSize: '12px', textAlign: 'center', margin: 0 }}>
                Waiting for updates...
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                }}
              >
                <div style={getMessageStyle(message.type)}>
                  {message.text}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: colors.textSecondary,
                    marginLeft: '4px',
                  }}
                >
                  {getTimeString(message.timestamp)}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatNotificationPanel;
