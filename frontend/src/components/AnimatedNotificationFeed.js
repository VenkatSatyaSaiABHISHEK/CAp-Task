import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/AnimatedFeed.css';

const AnimatedNotificationFeed = ({ messages = [] }) => {
  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    setDisplayMessages(messages.slice(-6)); // Show last 6 messages
  }, [messages]);

  const getMessageIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="notification-feed-container">
      {/* Live Indicator */}
      <div className="feed-header">
        <div className="live-indicator">
          <motion.div
            className="live-pulse"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Live Feed</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <AnimatePresence mode="popLayout">
          {displayMessages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              className={`message-bubble message-${msg.type || 'info'}`}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                borderLeft: `3px solid ${getMessageColor(msg.type)}`,
              }}
            >
              <div className="message-icon" style={{ color: getMessageColor(msg.type) }}>
                {getMessageIcon(msg.type)}
              </div>
              <div className="message-content">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : 'now'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayMessages.length === 0 && (
          <motion.div
            className="empty-feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Info size={32} strokeWidth={1} />
            <p>No events yet. System waiting...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnimatedNotificationFeed;
