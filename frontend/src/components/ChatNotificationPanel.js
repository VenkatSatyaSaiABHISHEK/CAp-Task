import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ChatNotificationPanel = ({ messages = [], isOpen, onToggle }) => {
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

  // Count messages by type
  const errorCount = messages.filter(m => m.type === 'error').length;
  const totalCount = messages.length;

  return (
    <>
      {/* Floating Ball Button */}
      <motion.button
        onClick={() => onToggle(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: errorCount > 0 ? colors.error : colors.success,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
          color: 'white',
          fontSize: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ position: 'relative' }}>
          🔔
          {totalCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {totalCount}
            </span>
          )}
        </span>
      </motion.button>

      {/* Activity Panel - Opens on Click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '110px',
              right: '30px',
              width: '360px',
              maxHeight: '450px',
              backgroundColor: panelBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
              zIndex: '999',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: panelHeaderBg,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
              <button
                onClick={() => onToggle(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.textSecondary,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                      paddingTop: '40px',
                      color: colors.textSecondary,
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💧</div>
                    <p style={{ fontSize: '12px', textAlign: 'center', margin: 0 }}>
                      Waiting for updates...
                    </p>
                  </div>
                ) : (
                  messages
                    .reduce((unique, message) => {
                      const existing = unique.find(m => m.type === message.type);
                      if (!existing) {
                        unique.push(message);
                      }
                      return unique;
                    }, [])
                    .map((message) => {
                      const typeCount = messages.filter(m => m.type === message.type).length;
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '4px',
                          }}
                        >
                          <div style={{ ...getMessageStyle(message.type), width: '100%', wordBreak: 'break-word' }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', paddingRight: '8px' }}>
                              {message.text}
                            </p>
                            {typeCount > 1 && (
                              <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: '600', opacity: 0.8 }}>
                                {message.type === 'error' && `❌ x${typeCount}`}
                                {message.type === 'success' && `✓ x${typeCount}`}
                                {message.type === 'info' && `ℹ x${typeCount}`}
                              </div>
                            )}
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
                      );
                    })
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatNotificationPanel;
