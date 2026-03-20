import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Settings from './pages/Settings';
import Prediction from './pages/Prediction';
import Reports from './pages/Reports';
import { useTheme } from './context/ThemeContext';
import './styles/App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors, theme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);

  const bgColor = colors?.bg || '#ffffff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor: bgColor }}>
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isConnected={isConnected} />

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', backgroundColor: bgColor }}>
            <Routes>
              <Route path="/" element={<Home onMenuClick={() => setSidebarOpen(!sidebarOpen)} setIsConnected={setIsConnected} />} />
              <Route path="/analytics" element={<Analytics onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/prediction" element={<Prediction onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/history" element={<History onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/reports" element={<Reports onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
              <Route path="/settings" element={<Settings onMenuClick={() => setSidebarOpen(!sidebarOpen)} />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant theme={theme} />
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
