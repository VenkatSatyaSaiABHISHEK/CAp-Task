import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Moon, Sun } from 'lucide-react';
import { apiEndpoints } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import config from '../config';

const Prediction = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const [modelInfo, setModelInfo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [inputData, setInputData] = useState({
    distance: '',
    temperature: '',
    water_percent: 50,
    time_features: [new Date().getMinutes(), new Date().getHours()],
    node_id: 'node-1'
  });

  const softBorder = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
  const softShadow = theme === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.1)';
  const accentColor = '#8b5cf6';

  // Fetch model info on mount
  useEffect(() => {
    fetchModelInfo();
    fetchPredictionHistory();
    fetchLatestSensorData();
    
    // Auto-refresh sensor data every 5 seconds
    const interval = setInterval(fetchLatestSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await apiEndpoints.getModelInfo();
      setModelInfo(response.data.model_info);
      setError(null);
    } catch (err) {
      setError('Failed to fetch model info');
      console.error('Error:', err);
    }
  };

  const [predictionHistory, setPredictionHistory] = useState([]);

  const fetchLatestSensorData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/v1/sensor/latest`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.status === 'success' && data.sensor_data) {
        // Auto-fill temperature from sensor
        setInputData(prev => ({
          ...prev,
          temperature: data.sensor_data.temperature || prev.temperature,
          distance: data.sensor_data.distance || prev.distance
        }));
      }
    } catch (err) {
      console.error('Error fetching latest sensor data:', err);
    }
  };

  const fetchPredictionHistory = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/v1/activities/history?node_id=node-1&limit=50`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setPredictionHistory(data.data || []);
    } catch (err) {
      console.error('Error fetching activity history:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: name === 'water_percent' ? parseFloat(value) : value
    }));
  };

  // Calculate additional predictions from sensor data
  const calculateMultiplePredictions = (distance, temperature) => {
    const temp = parseFloat(temperature) || 25;
    const dist = parseFloat(distance);
    const TANK_HEIGHT = 192; // cm - updated for 192cm tank
    
    // Water Usage Efficiency (0-100) - updated for 192cm tank
    const efficiency = Math.max(0, Math.min(100, ((TANK_HEIGHT - dist) / TANK_HEIGHT) * 100));
    
    // Temperature Analysis
    let tempStatus = 'Normal';
    let tempColor = '#10b981';
    if (temp > 35) {
      tempStatus = 'High Temperature';
      tempColor = '#ef4444';
    } else if (temp < 15) {
      tempStatus = 'Low Temperature';
      tempColor = '#f59e0b';
    }
    
    // Anomaly Score (0-100, higher = more anomalous)
    const anomalyScore = Math.abs(temp - 25) * 2 + Math.random() * 10;
    
    // Leak Detection (0-100 risk score) - updated for 192cm tank
    // High risk: tank nearly empty (> 170cm from surface)
    // Low risk: tank has good water level (< 100cm from surface)
    const leakRisk = dist > 170 ? 75 : (dist < 100 ? 10 : 25);
    
    // Refill time estimate (in hours) - updated for 192cm tank
    const usagePerHour = 0.5; // cm per hour average (adjustable based on your usage)
    const refillHours = (TANK_HEIGHT - dist) / usagePerHour;
    
    return {
      efficiency: Math.round(efficiency),
      tempStatus,
      tempColor,
      anomalyScore: Math.round(anomalyScore),
      leakRisk: Math.round(leakRisk),
      refillHours: refillHours.toFixed(1)
    };
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    if (!inputData.distance) {
      setError('Please enter distance');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/v1/predict-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distance: parseFloat(inputData.distance),
          node_id: inputData.node_id
        })
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Add multiple predictions to the response
        const multiplePredictions = calculateMultiplePredictions(
          inputData.distance,
          inputData.temperature
        );
        setPrediction({ ...data, multiplePredictions });
        fetchPredictionHistory();
      } else {
        setError(data.message || 'Prediction failed');
      }
    } catch (err) {
      setError('Prediction failed: ' + (err.message || 'Network error'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          Prediction
        </h1>
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

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 'max(12px, 4vw)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'max(14px, 3vw)', 
          height: 'fit-content',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          
          {/* LEFT COLUMN - Model Info & Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Model Information */}
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
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Model Information
              </h3>
              {modelInfo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${softBorder}` }}>
                    <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: '500' }}>Type</span>
                    <span style={{ fontSize: '12px', color: colors.text, fontWeight: '600' }}>{modelInfo.model_type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${softBorder}` }}>
                    <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: '500' }}>Accuracy</span>
                    <span style={{ fontSize: '12px', color: accentColor, fontWeight: '600' }}>{(modelInfo.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${softBorder}` }}>
                    <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: '500' }}>Version</span>
                    <span style={{ fontSize: '12px', color: colors.text, fontWeight: '600' }}>{modelInfo.version}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: '500' }}>Total Predictions</span>
                    <span style={{ fontSize: '12px', color: colors.text, fontWeight: '600' }}>{modelInfo.total_predictions}</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Loading model info...</p>
              )}
            </motion.div>

            {/* Input Form */}
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onSubmit={handlePredict}
              style={{
                backgroundColor: colors.card,
                borderRadius: '12px',
                border: `1px solid ${softBorder}`,
                padding: '18px',
                boxShadow: `0 1px 3px ${softShadow}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Sensor Data
              </h3>
              
              {error && (
                <div style={{ fontSize: '12px', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' }}>
                  Distance (cm) <span style={{ fontSize: '10px', fontWeight: '400', color: '#10b981' }}>Auto-filled • Edit to override</span>
                </label>
                <input
                  type="number"
                  name="distance"
                  value={inputData.distance}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from sensor"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '12px',
                    border: `1px solid ${softBorder}`,
                    borderRadius: '8px',
                    backgroundColor: colors.bg,
                    color: colors.text,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = accentColor}
                  onBlur={(e) => e.target.style.borderColor = softBorder}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' }}>
                  Temperature (°C) <span style={{ fontSize: '10px', fontWeight: '400', color: '#10b981' }}>Auto-filled • Edit to override</span>
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={inputData.temperature}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from sensor"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '12px',
                    border: `1px solid ${softBorder}`,
                    borderRadius: '8px',
                    backgroundColor: colors.bg,
                    color: colors.text,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = accentColor}
                  onBlur={(e) => e.target.style.borderColor = softBorder}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Water Level
                  </label>
                  <span style={{ fontSize: '11px', color: accentColor, fontWeight: '600' }}>{inputData.water_percent}%</span>
                </div>
                <input
                  type="range"
                  name="water_percent"
                  min="0"
                  max="100"
                  value={inputData.water_percent}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    accentColor: accentColor,
                    cursor: 'pointer',
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: accentColor,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s ease',
                  marginTop: '4px',
                }}
              >
                {loading ? '⏳ Predicting...' : '🔮 Make Prediction'}
              </button>

              {/* Alternative Input Methods */}
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: `1px solid ${softBorder}`,
              }}>
                <p style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  📌 Quick Input Methods:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setInputData(prev => ({...prev, distance: '35', temperature: '25'}));
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      border: `1px solid ${softBorder}`,
                      borderRadius: '6px',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = accentColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.bg;
                      e.target.style.color = colors.text;
                    }}
                  >
                    ✅ Low Tank (35cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputData(prev => ({...prev, distance: '50', temperature: '28'}));
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      border: `1px solid ${softBorder}`,
                      borderRadius: '6px',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = accentColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.bg;
                      e.target.style.color = colors.text;
                    }}
                  >
                    🟡 Medium (50cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputData(prev => ({...prev, distance: '25', temperature: '21'}));
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      border: `1px solid ${softBorder}`,
                      borderRadius: '6px',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = accentColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.bg;
                      e.target.style.color = colors.text;
                    }}
                  >
                    🔴 High (25cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInputData(prev => ({...prev, distance: '10', temperature: '35'}));
                    }}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      border: `1px solid ${softBorder}`,
                      borderRadius: '6px',
                      backgroundColor: colors.bg,
                      color: colors.text,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = accentColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.bg;
                      e.target.style.color = colors.text;
                    }}
                  >
                    ⚠️ Very Low (10cm)
                  </button>
                </div>
              </div>
            </motion.form>
          </div>

          {/* RIGHT COLUMN - Prediction Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {prediction ? (
              <>
                {/* Main Activity Prediction */}
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
                  <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Prediction Result
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ 
                      backgroundColor: `${accentColor}15`,
                      border: `1px solid ${accentColor}30`,
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        Activity Type
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: accentColor, margin: 0, textTransform: 'capitalize' }}>
                        {prediction.activity}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '500', textTransform: 'uppercase' }}>Confidence</span>
                        <span style={{ fontSize: '12px', color: accentColor, fontWeight: '600' }}>
                          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: softBorder, borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${prediction.confidence * 100}%`,
                          backgroundColor: accentColor,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    {prediction.features && (
                      <div style={{ paddingTop: '8px', borderTop: `1px solid ${softBorder}` }}>
                        <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                          Features
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          <div>
                            <span style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '500' }}>Distance</span>
                            <p style={{ fontSize: '12px', color: colors.text, margin: '2px 0 0 0', fontWeight: '600' }}>
                              {prediction.features.distance.toFixed(1)} cm
                            </p>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '500' }}>Diff</span>
                            <p style={{ fontSize: '12px', color: colors.text, margin: '2px 0 0 0', fontWeight: '600' }}>
                              {prediction.features.diff.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '500' }}>Slope</span>
                            <p style={{ fontSize: '12px', color: colors.text, margin: '2px 0 0 0', fontWeight: '600' }}>
                              {prediction.features.slope.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ paddingTop: '8px', borderTop: `1px solid ${softBorder}` }}>
                      <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '0 0 6px 0', fontWeight: '500' }}>
                        Timestamp
                      </p>
                      <p style={{ fontSize: '12px', color: colors.text, margin: 0, fontWeight: '500' }}>
                        {new Date(prediction.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {/* Explain This Prediction Button */}
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: `1px solid ${accentColor}`,
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: accentColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = `${accentColor}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      {showExplanation ? '📖 Hide Explanation' : '📖 Why This Result?'}
                    </button>
                  </div>
                </motion.div>

                {/* Detailed Explanation */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `2px solid ${accentColor}30`,
                      padding: '16px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                      gridColumn: '1 / -1'
                    }}
                  >
                    <h3 style={{ fontSize: '12px', fontWeight: '600', color: colors.text, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      📖 How This Prediction Was Made:
                    </h3>

                    {/* Input Data Used */}
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${softBorder}` }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                        ✅ Input Data Used:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px' }}>
                          <p style={{ fontSize: '9px', color: colors.textSecondary, margin: '0 0 4px 0' }}>Distance</p>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: colors.text, margin: 0 }}>
                            {inputData.distance} cm
                          </p>
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px' }}>
                          <p style={{ fontSize: '9px', color: colors.textSecondary, margin: '0 0 4px 0' }}>Temperature</p>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: colors.text, margin: 0 }}>
                            {inputData.temperature}°C
                          </p>
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px' }}>
                          <p style={{ fontSize: '9px', color: colors.textSecondary, margin: '0 0 4px 0' }}>Tank Height</p>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: colors.text, margin: 0 }}>
                            192 cm
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Calculation Steps */}
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${softBorder}` }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                        🔢 Calculation Steps:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'monospace' }}>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', color: colors.text }}>
                          Water Height = Tank Height - Distance
                          <br/>= 192 - {inputData.distance} = {192 - parseFloat(inputData.distance)} cm
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', color: colors.text }}>
                          Water % = (Water Height ÷ Tank Height) × 100
                          <br/>= ({192 - parseFloat(inputData.distance)} ÷ 192) × 100 = {(((192 - parseFloat(inputData.distance)) / 192) * 100).toFixed(1)}%
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', color: colors.text }}>
                          Water Liters = (Water Height ÷ Tank Height) × 2000L
                          <br/>= ({192 - parseFloat(inputData.distance)} ÷ 192) × 2000 = {(((192 - parseFloat(inputData.distance)) / 192) * 2000).toFixed(1)} L
                        </div>
                      </div>
                    </div>

                    {/* Why This Activity */}
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${softBorder}` }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                        🎯 Why This Activity?
                      </p>
                      <div style={{ padding: '10px', backgroundColor: `${accentColor}15`, borderLeft: `3px solid ${accentColor}`, borderRadius: '4px', fontSize: '11px', color: colors.text }}>
                        {prediction.activity === 'filling' && `Distance decreased (water rising) = Someone is ADDING water to tank`}
                        {prediction.activity === 'flush' && `Water drops VERY FAST = Toilet being FLUSHED`}
                        {prediction.activity === 'geyser' && `Water level slowly decreases = GEYSER/HEATER using water`}
                        {prediction.activity === 'washing_machine' && `Water level goes UP/DOWN repeatedly = WASHING MACHINE cycle`}
                        {prediction.activity === 'no_activity' && `No significant changes detected = NO ACTIVITY happening`}
                      </div>
                    </div>

                    {/* Example Scenarios */}
                    <div>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                        💡 Example Scenarios:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '10px' }}>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', borderLeft: `2px solid #10b981` }}>
                          <strong>Distance: 10cm</strong><br/>
                          = 182cm water = <strong>94.8%</strong> = FULL ✓
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', borderLeft: `2px solid #f59e0b` }}>
                          <strong>Distance: 96cm</strong><br/>
                          = 96cm water = <strong>50.0%</strong> = MEDIUM ⚠️
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', borderLeft: `2px solid #ef4444` }}>
                          <strong>Distance: 170cm</strong><br/>
                          = 22cm water = <strong>11.5%</strong> = LOW 🔴
                        </div>
                        <div style={{ padding: '8px', backgroundColor: colors.bg, borderRadius: '6px', borderLeft: `2px solid #ef4444` }}>
                          <strong>Distance: 190cm</strong><br/>
                          = 2cm water = <strong>1.0%</strong> = EMPTY ❌
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Multiple Predictions Grid */}
                {prediction.multiplePredictions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}
                  >
                    {/* Water Usage Efficiency */}
                    <div style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${softBorder}`,
                      padding: '14px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                    }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                        💧 Usage Efficiency
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', margin: '0 0 6px 0' }}>
                        {prediction.multiplePredictions.efficiency}%
                      </p>
                      <div style={{ width: '100%', height: '4px', backgroundColor: softBorder, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${prediction.multiplePredictions.efficiency}%`,
                          backgroundColor: '#10b981'
                        }} />
                      </div>
                    </div>

                    {/* Temperature Status */}
                    <div style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${softBorder}`,
                      padding: '14px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                    }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                        🌡️ Temperature
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: prediction.multiplePredictions.tempColor, margin: '0 0 4px 0' }}>
                        {prediction.multiplePredictions.tempStatus}
                      </p>
                      <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>
                        {inputData.temperature || '—'}°C
                      </p>
                    </div>

                    {/* Anomaly Detection */}
                    <div style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${softBorder}`,
                      padding: '14px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                    }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                        ⚠️ Anomaly Score
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: prediction.multiplePredictions.anomalyScore > 50 ? '#ef4444' : '#f59e0b', margin: '0 0 6px 0' }}>
                        {prediction.multiplePredictions.anomalyScore}
                      </p>
                      <div style={{ width: '100%', height: '4px', backgroundColor: softBorder, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${prediction.multiplePredictions.anomalyScore}%`,
                          backgroundColor: prediction.multiplePredictions.anomalyScore > 50 ? '#ef4444' : '#f59e0b'
                        }} />
                      </div>
                    </div>

                    {/* Leak Detection Risk */}
                    <div style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${softBorder}`,
                      padding: '14px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                    }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                        🚨 Leak Risk
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: prediction.multiplePredictions.leakRisk > 50 ? '#ef4444' : '#10b981', margin: '0 0 6px 0' }}>
                        {prediction.multiplePredictions.leakRisk}%
                      </p>
                      <div style={{ width: '100%', height: '4px', backgroundColor: softBorder, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${prediction.multiplePredictions.leakRisk}%`,
                          backgroundColor: prediction.multiplePredictions.leakRisk > 50 ? '#ef4444' : '#10b981'
                        }} />
                      </div>
                    </div>

                    {/* Refill Time Estimate */}
                    <div style={{
                      backgroundColor: colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${softBorder}`,
                      padding: '14px',
                      boxShadow: `0 1px 3px ${softShadow}`,
                      gridColumn: '1 / -1'
                    }}>
                      <p style={{ fontSize: '10px', color: colors.textSecondary, margin: '0 0 8px 0', fontWeight: '500', textTransform: 'uppercase' }}>
                        ⏱️ Estimated Refill Time
                      </p>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: accentColor, margin: '0 0 4px 0' }}>
                        {prediction.multiplePredictions.refillHours} hrs
                      </p>
                      <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>
                        Until tank is full at current usage rate
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: '12px',
                  border: `1px solid ${softBorder}`,
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: `0 1px 3px ${softShadow}`,
                }}
              >
                <Brain size={32} style={{ color: colors.textSecondary, marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                  Enter data and predict to see results
                </p>
              </motion.div>
            )}

            {/* Recent Predictions */}
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
              <h3 style={{ fontSize: '13px', fontWeight: '500', color: colors.text, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Recent Activity
              </h3>
              
              {predictionHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {predictionHistory.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: colors.bg,
                        borderRadius: '6px',
                        border: `1px solid ${softBorder}`,
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0, fontWeight: '500' }}>
                          {new Date(item.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {item.activity}
                      </div>
                      <span style={{ fontSize: '10px', color: colors.textSecondary, fontWeight: '500' }}>
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>No activities recorded yet</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
