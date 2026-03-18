import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Settings from './pages/Settings';
import Prediction from './pages/Prediction';
import { useTheme } from './context/ThemeContext';
import './styles/App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors, theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);

  // Safeguard: ensure colors has a value
  const bgColor = colors?.bg || '#ffffff';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: bgColor }}>
      {/* Left Sidebar - Always visible on desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Takes remaining space after sidebar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginLeft: 0,
        }}
      >
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isConnected={isConnected} />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: bgColor,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Home onMenuClick={() => setSidebarOpen(!sidebarOpen)} setIsConnected={setIsConnected} />}
            />
            <Route
              path="/analytics"
              element={<Analytics onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
            />
            <Route
              path="/prediction"
              element={<Prediction onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
            />
            <Route
              path="/history"
              element={<History onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
            />
            <Route
              path="/settings"
              element={<Settings onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
            />
          </Routes>
        </div>
      </div>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="margin-left: 260px"] {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
