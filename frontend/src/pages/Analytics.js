import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiEndpoints } from '../utils/api';

const Analytics = ({ onMenuClick }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState({
    weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
    hourlyUsage: Array(8).fill(0),
    temperature: 0,
    avgConsumption: 0,
    peakUsage: 0,
    totalStored: 0,
    dataPoints: 0,
    temperatureStatus: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch last 7 days of data (approximately)
      const response = await apiEndpoints.getSensorHistory(1000);
      
      if (response.data && response.data.data) {
        const sensorData = response.data.data.reverse();
        
        // Process data for analytics
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Initialize arrays
        const weeklyData = Array(7).fill(0);
        const hourlyData = Array(8).fill(0);
        const temperatures = [];
        let totalStored = 0;
        let maxUsage = 0;
        
        sensorData.forEach(reading => {
          const readingDate = new Date(reading.timestamp);
          
          // Weekly trend (last 7 days)
          if (readingDate >= weekAgo) {
            const dayIndex = Math.floor((readingDate - weekAgo) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < 7) {
              // Accumulate water liters per day
              weeklyData[dayIndex] += reading.water_liters || 0;
            }
          }
          
          // Hourly usage (today only)
          if (readingDate >= todayStart) {
            const hour = readingDate.getHours();
            const hourIndex = Math.floor(hour / 3); // Group into 3-hour intervals
            if (hourIndex >= 0 && hourIndex < 8) {
              hourlyData[hourIndex] += reading.water_liters || 0;
            }
          }
          
          // Collect temperatures
          temperatures.push(reading.temperature);
          totalStored = reading.water_liters || 0; // Latest value
          
          // Track peak usage
          const usage = reading.water_percent || 0;
          if (usage > maxUsage) maxUsage = usage;
        });
        
        // Calculate metrics
        const avgTemp = temperatures.length > 0
          ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
          : 0;
        
        const tempStatus = avgTemp < 15 ? 'Cold' : avgTemp > 35 ? 'Hot' : 'Optimal';
        
        const avgConsumption = weeklyData.length > 0
          ? Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)
          : 0;
        
        // Convert arrays - scale for visualization (max height 100)
        const maxWeekly = Math.max(...weeklyData, 100);
        const scaledWeekly = weeklyData.map(v => Math.round((v / maxWeekly) * 100) || 0);
        
        const maxHourly = Math.max(...hourlyData, 50);
        const scaledHourly = hourlyData.map(v => Math.round((v / maxHourly) * 100) || 0);
        
        setAnalyticsData({
          weeklyTrend: scaledWeekly,
          hourlyUsage: scaledHourly,
          temperature: avgTemp,
          avgConsumption: avgConsumption,
          peakUsage: Math.round(maxUsage),
          totalStored: Math.round(totalStored / 1000 * 10) / 10, // Convert to K
          dataPoints: sensorData.length,
          temperatureStatus: tempStatus
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const softBorder = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const softShadow = theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.1)';
  const accentColor = '#8b5cf6';

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: colors.bg }}>
      {/* Minimal Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: `1px solid ${softBorder}`,
          backgroundColor: colors.card,
          height: '50px',
        }}
      >
        <h1 style={{ fontSize: '14px', fontWeight: '500', color: colors.text, margin: 0, flex: 1, letterSpacing: '-0.3px' }}>
          Analytics
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {loading && (
            <span style={{ fontSize: '12px', color: colors.textSecondary }}>
              Fetching real data...
            </span>
          )}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: colors.textSecondary,
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', height: 'fit-content' }}>
          
          {/* LEFT COLUMN - Charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Water Usage Trend */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '18px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0, marginBottom: '2px' }}>
                  Water Usage Trend
                </h3>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Last 7 days (Liters)</p>
              </div>
              <svg viewBox="0 0 350 140" style={{ width: '100%', height: '160px' }}>
                {/* Grid lines */}
                {[10, 40, 70, 100].map((y) => (
                  <line key={y} x1="40" y1={y} x2="330" y2={y} stroke={softBorder} strokeWidth="0.5" />
                ))}
                
                {/* Axes */}
                <line x1="40" y1="100" x2="330" y2="100" stroke={softBorder} strokeWidth="0.8" />
                <line x1="40" y1="10" x2="40" y2="100" stroke={softBorder} strokeWidth="0.8" />
                
                {/* Y-axis labels (values) */}
                {[100, 75, 50, 25].map((val, i) => (
                  <text key={`ylabel-${i}`} x="25" y={15 + i * 30} fontSize="10" fill={colors.textSecondary} textAnchor="end">
                    {val}L
                  </text>
                ))}
                
                {/* Data line - using real data */}
                <polyline 
                  points={`40,${100 - analyticsData.weeklyTrend[0]} 80,${100 - analyticsData.weeklyTrend[1]} 120,${100 - analyticsData.weeklyTrend[2]} 160,${100 - analyticsData.weeklyTrend[3]} 200,${100 - analyticsData.weeklyTrend[4]} 240,${100 - analyticsData.weeklyTrend[5]} 280,${100 - analyticsData.weeklyTrend[6]}`}
                  fill="none" 
                  stroke={accentColor} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                
                {/* Data points - using real data */}
                {[40, 80, 120, 160, 200, 240, 280].map((x, i) => (
                  <circle 
                    key={i} 
                    cx={x} 
                    cy={100 - analyticsData.weeklyTrend[i]} 
                    r="3" 
                    fill={accentColor} 
                  />
                ))}
                
                {/* X-axis labels (days) */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <text key={i} x={40 + i * 40} y="125" fontSize="11" fill={colors.textSecondary} textAnchor="middle" fontWeight="500">
                    {day}
                  </text>
                ))}
              </svg>
            </motion.div>

            {/* Hourly Consumption */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '18px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: 0, marginBottom: '2px' }}>
                  Hourly Consumption
                </h3>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Today's usage (Liters)</p>
              </div>
              <svg viewBox="0 0 350 140" style={{ width: '100%', height: '160px' }}>
                {/* Grid lines */}
                {[10, 40, 70, 100].map((y) => (
                  <line key={y} x1="40" y1={y} x2="330" y2={y} stroke={softBorder} strokeWidth="0.5" />
                ))}
                
                {/* Axes */}
                <line x1="40" y1="100" x2="330" y2="100" stroke={softBorder} strokeWidth="0.8" />
                <line x1="40" y1="10" x2="40" y2="100" stroke={softBorder} strokeWidth="0.8" />
                
                {/* Y-axis labels (values) */}
                {[100, 75, 50, 25].map((val, i) => (
                  <text key={`ylabel-${i}`} x="25" y={15 + i * 30} fontSize="10" fill={colors.textSecondary} textAnchor="end">
                    {val}L
                  </text>
                ))}
                
                {/* Bars - using real data */}
                {[40, 80, 120, 160, 200, 240, 280, 320].map((x, i) => {
                  const height = analyticsData.hourlyUsage[i] || 0;
                  return (
                    <rect key={i} x={x - 8} y={100 - height} width="16" height={height} fill={accentColor} rx="2" opacity="0.85" />
                  );
                })}
                
                {/* X-axis labels (hours) */}
                {['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'].map((time, i) => (
                  <text key={i} x={40 + i * 36} y="125" fontSize="10" fill={colors.textSecondary} textAnchor="middle" fontWeight="500">
                    {time}
                  </text>
                ))}
              </svg>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Temperature - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              style={{
                background: theme === 'light'
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '16px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 6px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Temperature
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <p style={{ fontSize: '28px', fontWeight: '600', color: colors.text, margin: 0 }}>
                  {analyticsData.temperature}
                </p>
                <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>°C</p>
              </div>
              <p style={{ fontSize: '11px', color: accentColor, margin: '6px 0 0 0', fontWeight: '500' }}>{analyticsData.temperatureStatus}</p>
            </motion.div>

            {/* Metrics - Stacked Cards */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '14px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 10px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Avg Consumption
              </p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: colors.text, margin: 0 }}>
                {analyticsData.avgConsumption} <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '400' }}>L</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '14px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 10px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Peak Usage
              </p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: colors.text, margin: 0 }}>
                {analyticsData.peakUsage} <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '400' }}>%</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '14px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 10px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Total Stored
              </p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: colors.text, margin: 0 }}>
                {analyticsData.totalStored}K <span style={{ fontSize: '13px', color: colors.textSecondary, fontWeight: '400' }}>L</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '14px',
                boxShadow: `0 1px 3px ${softShadow}`,
              }}
            >
              <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 10px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Data Points
              </p>
              <p style={{ fontSize: '24px', fontWeight: '600', color: colors.text, margin: 0 }}>
                {analyticsData.dataPoints}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
