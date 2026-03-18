import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Thermometer, Droplets, Activity, Database, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ChatNotificationPanel from '../components/ChatNotificationPanel';
import { apiEndpoints } from '../utils/api';
import '../styles/Home.css';

const Home = ({ onMenuClick, setIsConnected }) => {
  const { colors, theme } = useTheme();
  const [sensorData, setSensorData] = useState(null);
  const [isConnected, setIsConnectedLocal] = useState(false);
  const [lastSync, setLastSync] = useState('Never');
  const [systemUptime] = useState('24h 15m');
  const [dataPoints] = useState(15340);
  const [messages, setMessages] = useState([
    { id: 1, text: 'System initialized and ready', type: 'info', timestamp: new Date(Date.now() - 5000) },
    { id: 2, text: 'Backend connected successfully', type: 'success', timestamp: new Date() },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiEndpoints.getSensorLatest();
        if (response.data && response.data.data) {
          const data = response.data.data;
          setSensorData({
            distance: parseFloat(data.distance) || 0,
            temperature: parseFloat(data.temperature) || 0,
            waterPercentage: parseFloat(data.water_percentage) || 0,
            waterLevel: parseFloat(data.water_liters) || 0,
            timestamp: data.timestamp || new Date(),
          });
          setIsConnectedLocal(true);
          if (setIsConnected) setIsConnected(true);
          const now = new Date();
          setLastSync(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          addMessage(`Water level updated to ${data.water_percentage}%`, 'success');
        }
      } catch (error) {
        setIsConnectedLocal(false);
        if (setIsConnected) setIsConnected(false);
        addMessage('Connection error: Unable to fetch sensor data', 'error');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [setIsConnected]);

  const addMessage = (text, type = 'info') => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text, type, timestamp: new Date() }]);
  };

  const displayData = sensorData || {
    distance: 0,
    temperature: 0,
    waterPercentage: 0,
    waterLevel: 0,
  };

  const pageStyle = {
    backgroundColor: colors.bg,
    minHeight: '100%',
    transition: 'background-color 0.3s ease',
    padding: '32px 24px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const sectionTitleStyle = {
    color: colors.text,
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    letterSpacing: '-0.01em',
  };

  const sectionSubtitleStyle = {
    color: colors.textSecondary,
    fontSize: '12px',
    margin: '0 0 16px 0',
    fontWeight: '500',
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 1px 2px ${colors.shadow}`,
  };

  const glassCardStyle = {
    background: theme === 'day'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))'
      : 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(26, 26, 26, 0.6))',
    backdropFilter: 'blur(12px)',
    borderRadius: '12px',
    border: theme === 'day'
      ? '1px solid rgba(0, 0, 0, 0.05)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          <div>
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: '32px' }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: colors.text,
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.5px',
                }}
              >
                Water Tank Monitor
              </h2>
              <p style={{ fontSize: '13px', color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                Real-time monitoring and analytics
              </p>
            </motion.div>

            {/* Tank Level Card - Main */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{ ...glassCardStyle, marginBottom: '24px' }}
            >
              <div style={{ marginBottom: '20px' }}>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: colors.textSecondary,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Tank Level
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div
                    style={{
                      fontSize: '56px',
                      fontWeight: '800',
                      color: colors.text,
                      margin: '0 0 4px 0',
                      letterSpacing: '-1px',
                    }}
                  >
                    {displayData.waterPercentage.toFixed(1)}
                    <span style={{ fontSize: '28px', marginLeft: '6px', fontWeight: '700' }}>%</span>
                  </div>
                  <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                    {displayData.waterLevel.toFixed(1)}L stored
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '0 0 4px 0', fontWeight: '500' }}>
                    Last updated
                  </p>
                  <p style={{ fontSize: '13px', color: colors.text, fontWeight: '600', margin: 0 }}>
                    {lastSync}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  position: 'relative',
                  height: '10px',
                  backgroundColor: theme === 'day' ? '#e5e7eb' : '#2d2d2d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayData.waterPercentage}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background:
                      displayData.waterPercentage > 85
                        ? '#34d399'
                        : displayData.waterPercentage > 50
                          ? '#fbbf24'
                          : '#f87171',
                    borderRadius: '8px',
                    boxShadow:
                      displayData.waterPercentage > 85
                        ? '0 0 12px rgba(52, 211, 153, 0.4)'
                        : displayData.waterPercentage > 50
                          ? '0 0 12px rgba(251, 191, 36, 0.4)'
                          : '0 0 12px rgba(248, 113, 113, 0.4)',
                  }}
                />
              </div>

              {/* Status Message */}
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                {displayData.waterPercentage > 85
                  ? '✓ Tank is full'
                  : displayData.waterPercentage > 50
                    ? '● Tank is half full'
                    : displayData.waterPercentage > 20
                      ? '⚠ Tank is low'
                      : '!! Tank is critically low'}
              </p>
            </motion.div>

            {/* Live Readings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginBottom: '32px' }}
            >
              <h3 style={sectionTitleStyle}>Live Readings</h3>
              <p style={sectionSubtitleStyle}>Real-time sensor data</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {/* Distance Card */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Ruler size={16} color={colors.textSecondary} />
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, fontWeight: '600' }}>
                      Distance
                    </p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: colors.text, margin: 0 }}>
                    {displayData.distance.toFixed(1)}
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>cm</span>
                  </p>
                  <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: '500' }}>
                    From surface
                  </p>
                </div>

                {/* Temperature Card */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Thermometer size={16} color={colors.textSecondary} />
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, fontWeight: '600' }}>
                      Temperature
                    </p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: colors.text, margin: 0 }}>
                    {displayData.temperature.toFixed(1)}
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>°C</span>
                  </p>
                  <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: '500' }}>
                    Ambient
                  </p>
                </div>

                {/* Volume Card */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Droplets size={16} color={colors.textSecondary} />
                    <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0, fontWeight: '600' }}>
                      Status
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: isConnected ? colors.success : colors.error,
                      margin: 0,
                    }}
                  >
                    {isConnected ? 'Connected' : 'Offline'}
                  </p>
                  <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: '500' }}>
                    API Status
                  </p>
                </div>
              </div>
            </motion.div>

            {/* System Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ marginBottom: '32px' }}
            >
              <h3 style={sectionTitleStyle}>System Information</h3>
              <p style={sectionSubtitleStyle}>Operational status and details</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px',
                }}
              >
                <div style={cardStyle}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: colors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Connection
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: colors.text, margin: 0 }}>
                    {isConnected ? 'Active' : 'Lost'}
                  </p>
                </div>
                <div style={cardStyle}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: colors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    System Uptime
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: colors.text, margin: 0 }}>
                    {systemUptime}
                  </p>
                </div>
                <div style={cardStyle}>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: colors.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Data Points
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: colors.text, margin: 0 }}>
                    {dataPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Backend Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 style={sectionTitleStyle}>Backend Status</h3>
              <p style={sectionSubtitleStyle}>API and services health</p>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {/* API Server */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.success}30, ${colors.success}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Zap size={18} color={colors.success} />
                    </div>
                    <div>
                      <p style={{ color: colors.text, fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0' }}>
                        API Server
                      </p>
                      <p style={{ color: colors.success, fontSize: '11px', fontWeight: '600', margin: 0 }}>
                        V Operational
                      </p>
                    </div>
                  </div>

                  {/* Database */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.success}30, ${colors.success}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Database size={18} color={colors.success} />
                    </div>
                    <div>
                      <p style={{ color: colors.text, fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0' }}>
                        Database
                      </p>
                      <p style={{ color: colors.success, fontSize: '11px', fontWeight: '600', margin: 0 }}>
                        V Connected
                      </p>
                    </div>
                  </div>

                  {/* Data Processing */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colors.success}30, ${colors.success}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Activity size={18} color={colors.success} />
                    </div>
                    <div>
                      <p style={{ color: colors.text, fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0' }}>
                        Data Processing
                      </p>
                      <p style={{ color: colors.success, fontSize: '11px', fontWeight: '600', margin: 0 }}>
                        V Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Chat Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
            }}
          >
            <ChatNotificationPanel messages={messages} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
