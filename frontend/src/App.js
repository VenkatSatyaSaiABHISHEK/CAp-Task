import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
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
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = colors?.bg || '#ffffff';

  // Callback when data is loaded from Home page
  const handleDataLoaded = () => {
    setIsLoading(false);
  };

  // Show loading animation for 10 seconds, then display the page
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('[Animation Complete] 10s loading animation finished, showing page');
        setIsLoading(false);
      }
    }, 10000); // 10 second animation timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Main App */}
      {!isLoading && (
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
                  <Route path="/" element={<Home onMenuClick={() => setSidebarOpen(!sidebarOpen)} setIsConnected={setIsConnected} onDataLoaded={handleDataLoaded} />} />
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
      )}
    </>
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
