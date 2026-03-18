import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, FileText, Sun, Moon, Bell, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = ({ isConnected = false }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Analytics', icon: TrendingUp },
    { label: 'History', icon: Clock },
    { label: 'Reports', icon: FileText },
  ];

  return (
    <nav
      style={{
        background: `linear-gradient(90deg, ${colors.card}, ${colors.bgSecondary})`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`,
        boxShadow: `0 1px 3px ${colors.shadow}`,
      }}
      className="navbar-premium"
    >
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">💧</div>
          <div>
            <div className="logo-main">KIET</div>
            <div className="logo-sub">Water IoT</div>
          </div>
        </div>

        {/* Center Navigation - Desktop */}
        <div className="navbar-nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                className="nav-item"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: colors.textSecondary }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Connection Status */}
          <motion.div
            className="connection-chip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isConnected ? colors.success : colors.error}`,
              color: isConnected ? colors.success : colors.error,
            }}
          >
            {isConnected ? (
              <>
                <motion.div
                  className="status-pulse"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ backgroundColor: colors.success }}
                />
                <Wifi size={14} />
                <span>Connected</span>
              </>
            ) : (
              <>
                <motion.div
                  className="status-pulse"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ backgroundColor: colors.error }}
                />
                <WifiOff size={14} />
                <span>Offline</span>
              </>
            )}
          </motion.div>

          {/* Notifications */}
          <motion.button
            className="navbar-icon-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: colors.textSecondary }}
          >
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            className="navbar-icon-btn"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.95 }}
            style={{ color: colors.accent }}
          >
            {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Profile Menu */}
          <motion.button
            className="profile-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, #1e40af)`,
              color: 'white',
            }}
          >
            A
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: colors.text }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="navbar-mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.bgSecondary,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="mobile-nav-item"
                style={{ color: colors.text }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
