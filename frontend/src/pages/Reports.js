import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Download, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiEndpoints } from '../utils/api';

const Reports = ({ onMenuClick }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const [reportsData, setReportsData] = useState({
    totalUsage: 0,
    averageDaily: 0,
    peakDay: 0,
    leakRiskDays: 0,
    anomalies: 0,
    systemUptime: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');

  const softBorder = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const softShadow = theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.1)';
  const accentColor = '#8b5cf6';
  const warnColor = '#f59e0b';
  const successColor = '#10b981';

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const response = await apiEndpoints.getSensorHistory(1000);
      
      if (response.data && response.data.data) {
        const sensorData = response.data.data.reverse();
        const now = new Date();
        let startDate;

        // Set date range
        switch(dateRange) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Filter data by date range
        const filteredData = sensorData.filter(d => new Date(d.timestamp) >= startDate);
        
        if (filteredData.length === 0) {
          setReportsData({
            totalUsage: 0,
            averageDaily: 0,
            peakDay: 0,
            leakRiskDays: 0,
            anomalies: 0,
            systemUptime: 100
          });
          setLoading(false);
          return;
        }

        // Calculate metrics
        let totalUsage = 0;
        let dayUsage = {};
        let anomalyCount = 0;
        let leakRiskCount = 0;
        const uniqueDays = new Set();

        filteredData.forEach(reading => {
          // Total usage
          totalUsage += reading.water_liters || 0;

          // Daily usage tracking
          const date = new Date(reading.timestamp).toDateString();
          dayUsage[date] = (dayUsage[date] || 0) + (reading.water_liters || 0);
          uniqueDays.add(date);

          // Anomaly detection (if any anomaly field exists)
          if (reading.anomaly_score > 60) {
            anomalyCount++;
          }

          // Leak risk detection
          if (reading.leak_risk > 60) {
            leakRiskCount++;
          }
        });

        const dailyUsages = Object.values(dayUsage);
        const averageDaily = Math.round(totalUsage / (uniqueDays.size || 1));
        const peakDay = Math.max(...dailyUsages, 0);

        setReportsData({
          totalUsage: Math.round(totalUsage),
          averageDaily: averageDaily,
          peakDay: Math.round(peakDay),
          leakRiskDays: leakRiskCount,
          anomalies: anomalyCount,
          systemUptime: 99.8
        });
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const report = `
Water Tank Management Report
Generated: ${new Date().toLocaleString()}
Date Range: ${dateRange}

--- SUMMARY ---
Total Water Usage: ${reportsData.totalUsage} Liters
Average Daily Usage: ${reportsData.averageDaily} Liters
Peak Day Usage: ${reportsData.peakDay} Liters
Days with Leak Risk: ${reportsData.leakRiskDays}
Anomalies Detected: ${reportsData.anomalies}
System Uptime: ${reportsData.systemUptime}%

--- INSIGHTS ---
${reportsData.totalUsage > 5000 ? '⚠️ High water consumption detected' : '✅ Normal water consumption'}
${reportsData.leakRiskDays > 0 ? '🚨 Potential leaks detected on some days' : '✅ No significant leak risks'}
${reportsData.anomalies > 0 ? '⚠️ Unusual patterns detected' : '✅ System operating normally'}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `water-tank-report-${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', backgroundColor: colors.bg }}>
      {/* Header */}
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
          Reports
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {loading && (
            <span style={{ fontSize: '12px', color: colors.textSecondary }}>
              Generating report...
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
        
        {/* Date Range Selector */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setDateRange('7days')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '6px',
              border: `1px solid ${dateRange === '7days' ? accentColor : softBorder}`,
              backgroundColor: dateRange === '7days' ? accentColor : colors.card,
              color: dateRange === '7days' ? 'white' : colors.text,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30days')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '6px',
              border: `1px solid ${dateRange === '30days' ? accentColor : softBorder}`,
              backgroundColor: dateRange === '30days' ? accentColor : colors.card,
              color: dateRange === '30days' ? 'white' : colors.text,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('90days')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '6px',
              border: `1px solid ${dateRange === '90days' ? accentColor : softBorder}`,
              backgroundColor: dateRange === '90days' ? accentColor : colors.card,
              color: dateRange === '90days' ? 'white' : colors.text,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            90 Days
          </button>
        </div>

        {/* Reports Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          {/* Total Usage */}
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
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Total Water Usage
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: colors.text, margin: 0 }}>
              {reportsData.totalUsage.toLocaleString()} <span style={{ fontSize: '14px', color: colors.textSecondary }}>L</span>
            </p>
          </motion.div>

          {/* Average Daily */}
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
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Average Daily
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: colors.text, margin: 0 }}>
              {reportsData.averageDaily} <span style={{ fontSize: '14px', color: colors.textSecondary }}>L</span>
            </p>
          </motion.div>

          {/* Peak Day */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${softBorder}`,
              padding: '18px',
              boxShadow: `0 1px 3px ${softShadow}`,
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Peak Day Usage
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: colors.text, margin: 0 }}>
              {reportsData.peakDay} <span style={{ fontSize: '14px', color: colors.textSecondary }}>L</span>
            </p>
          </motion.div>

          {/* System Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${softBorder}`,
              padding: '18px',
              boxShadow: `0 1px 3px ${softShadow}`,
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              System Uptime
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: successColor, margin: 0 }}>
              {reportsData.systemUptime}%
            </p>
          </motion.div>

          {/* Anomalies */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${softBorder}`,
              padding: '18px',
              boxShadow: `0 1px 3px ${softShadow}`,
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Anomalies Detected
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: reportsData.anomalies > 0 ? warnColor : successColor, margin: 0 }}>
              {reportsData.anomalies}
            </p>
          </motion.div>

          {/* Leak Risk Days */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              backgroundColor: colors.card,
              borderRadius: '12px',
              border: `1px solid ${softBorder}`,
              padding: '18px',
              boxShadow: `0 1px 3px ${softShadow}`,
            }}
          >
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Leak Risk Days
            </p>
            <p style={{ fontSize: '28px', fontWeight: '600', color: reportsData.leakRiskDays > 0 ? '#ef4444' : successColor, margin: 0 }}>
              {reportsData.leakRiskDays}
            </p>
          </motion.div>
        </div>

        {/* Download Button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          onClick={downloadReport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: accentColor,
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 6px 16px rgba(139, 92, 246, 0.4)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Download size={16} />
          Download Report
        </motion.button>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            marginTop: '24px',
            backgroundColor: colors.card,
            borderRadius: '12px',
            border: `1px solid ${softBorder}`,
            padding: '18px',
            boxShadow: `0 1px 3px ${softShadow}`,
          }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: colors.text, margin: '0 0 12px 0' }}>
            📊 Key Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>
              ✅ {reportsData.totalUsage > 5000 
                ? `High usage detected: ${reportsData.totalUsage}L consumed in this period` 
                : `Moderate usage: ${reportsData.totalUsage}L consumed in this period`}
            </div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>
              {reportsData.leakRiskDays > 0 
                ? `⚠️ Leak risk detected on ${reportsData.leakRiskDays} instances - Consider inspection` 
                : `✅ No significant leak risks detected`}
            </div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>
              {reportsData.anomalies > 0 
                ? `⚠️ ${reportsData.anomalies} anomalies detected - Unusual patterns observed` 
                : `✅ System operating normally with no anomalies`}
            </div>
            <div style={{ fontSize: '13px', color: colors.textSecondary }}>
              📈 Current system uptime: {reportsData.systemUptime}%
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
