import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import '../styles/AIAssistant.css';

const AIAssistant = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Water Tank Assistant 🤖",
      subtext: "I can help you understand the system. Ask me anything!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Knowledge base for the assistant
  const knowledge = {
    'what is tank level': {
      text: '💧 Tank Level shows how much water is currently in your tank as a percentage (0-100%). \n\nExample: If it shows 88%, that means your 2000-liter tank has about 1760 liters of water. The higher the percentage, the more water you have.',
      keywords: ['tank', 'level', 'water', 'percentage', 'how much']
    },
    'what is efficiency': {
      text: '⚡ Water Usage Efficiency shows what percentage of the tank is currently full.\n\nExample: 89% efficiency = Tank is 89% full\n\nWhy? Higher efficiency = More water available = Less need to refill soon.',
      keywords: ['efficiency', 'usage', 'what', 'percent']
    },
    'what is anomaly': {
      text: '⚠️ Anomaly Score (0-100) tells you if something unusual is happening.\n\n🟢 Low (0-30): Everything is normal ✓\n🟡 Medium (30-60): Something slightly unusual\n🔴 High (60-100): Something is definitely wrong\n\nExample: If temperature suddenly jumps from 25°C to 40°C, anomaly score goes HIGH.',
      keywords: ['anomaly', 'score', 'unusual', 'weird', 'normal']
    },
    'what is leak risk': {
      text: '🚨 Leak Risk shows the danger of water leaking from your tank (0-100%).\n\n🟢 0-30%: Safe, no leak risk\n🟡 30-60%: Possible small leak\n🔴 60-100%: High risk, check tank!\n\nRisk increases when:\n• Tank is very low (near empty)\n• Temperature changes suddenly\n• Water level drops too fast',
      keywords: ['leak', 'risk', 'danger', 'water', 'lose']
    },
    'what is temperature': {
      text: '🌡️ Temperature Status shows if the water temperature is healthy.\n\n🟢 Normal: 15-35°C (Good for most uses)\n🟡 Low Temp: Below 15°C (Cold water)\n🔴 High Temp: Above 35°C (Hot water)\n\nWhy it matters? Too cold = Bad for usage. Too hot = Possible leak or heating issue.',
      keywords: ['temperature', 'temp', 'hot', 'cold', 'degree']
    },
    'what is refill time': {
      text: '⏱️ Refill Time shows how many HOURS until your tank becomes completely full.\n\nExample: "342.0 hrs" = About 14 days until tank is full\n\nWhy? If you use water slowly, it takes longer to fill.\nIf tank is more full (like 89%), refill time is longer because less water needs to be added.',
      keywords: ['refill', 'time', 'how long', 'full', 'hours', 'days']
    },
    'what is confidence': {
      text: '✅ Confidence (0-100%) shows how sure the system is about what activity is happening.\n\nExample:\n• 90% Confidence = System is VERY sure it\'s filling ✓\n• 50% Confidence = System is not very sure\n\nHigher confidence = More reliable prediction',
      keywords: ['confidence', 'sure', 'certain', 'predict', 'activity']
    },
    'what is filling': {
      text: '💧 FILLING = Someone is adding water to the tank RIGHT NOW.\n\nHow does it detect? When water distance from top DECREASES (getting closer to sensor), it means water level is RISING = FILLING',
      keywords: ['filling', 'activity', 'adding', 'water', 'fill']
    },
    'what is washing machine': {
      text: '🧺 WASHING MACHINE = Your washing machine is currently using water.\n\nHow does it detect? Water level goes UP and DOWN repeatedly (intermittent use), which is typical for washing machine cycles.',
      keywords: ['washing', 'machine', 'activity', 'wash']
    },
    'what is geyser': {
      text: '🚿 GEYSER = Your water heater (geyser) is currently using water.\n\nHow does it detect? Water level slowly DECREASES in a steady way (continuous flow) without big changes = Geyser usage',
      keywords: ['geyser', 'heater', 'activity', 'hot']
    },
    'what is flushing': {
      text: '🚽 FLUSHING = Toilet is being flushed RIGHT NOW.\n\nHow does it detect? Water level drops VERY FAST suddenly = Flush action',
      keywords: ['flush', 'flushing', 'activity', 'toilet']
    },
    'how does it work': {
      text: '🔧 HOW YOUR SYSTEM WORKS:\n\n1️⃣ ESP32 (Sensor Device):\n   • Measures distance from top of tank\n   • Measures water temperature\n   • Sends data every 20 seconds\n\n2️⃣ Backend (Computer Server):\n   • Receives sensor data\n   • Analyzes patterns\n   • Predicts what activity is happening\n\n3️⃣ Frontend (Dashboard/Website):\n   • Shows all predictions\n   • Displays 6 different analyses\n   • Updates every 5 seconds\n\n4️⃣ Database:\n   • Stores all readings\n   • Stores prediction history\n   • Tracks patterns over time',
      keywords: ['how', 'work', 'system', 'works', 'process']
    },
    '6 predictions': {
      text: '📊 YOUR SYSTEM SHOWS 6 PREDICTIONS:\n\n1️⃣ ACTIVITY TYPE - What is happening (Filling, Flushing, etc.)\n2️⃣ CONFIDENCE - How sure (0-100%)\n3️⃣ EFFICIENCY - How full tank is (%)\n4️⃣ TEMPERATURE - Is temp normal/hot/cold\n5️⃣ ANOMALY SCORE - Is something unusual (0-100)\n6️⃣ LEAK RISK - Chance of leak (0-100%)\n7️⃣ REFILL TIME - Hours until tank is full\n\nAll 6 work together to give you complete picture of your tank!',
      keywords: ['6', 'predictions', 'what', 'show', 'mean']
    },
    'hello': {
      text: '👋 Hey there! How can I help you understand your water tank system today? \n\nYou can ask me about:\n• Tank level\n• What predictions mean\n• How the system works\n• Types of activities\n• Anomalies and leaks\n• Or anything else!',
      keywords: ['hi', 'hello', 'hey', 'help', 'what']
    },
    'help': {
      text: '🆘 I can answer questions about:\n\n1. PREDICTIONS: tank level, efficiency, temperature, anomaly, leak risk, refill time, confidence\n2. ACTIVITIES: filling, flushing, geyser, washing machine\n3. SYSTEM: how it works, sensors, data flow\n4. TANK: capacity (2000L), height (192cm), distance range\n5. ANY DOUBT: Just ask in simple words!\n\nWhat would you like to know?',
      keywords: ['help', 'what', 'can', 'do', 'assist']
    }
  };

  const findAnswer = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, data] of Object.entries(knowledge)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.text;
      }
    }
    
    return "I'm not sure about that. Try asking about:\n• Tank level\n• Predictions (efficiency, anomaly, leak risk, etc.)\n• System activities (filling, flushing, geyser, washing)\n• How the system works\n\nOr ask in different words! 😊";
  };

  const handleSelectChange = (e) => {
    const selectedQuestion = e.target.value;
    if (!selectedQuestion) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: selectedQuestion,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Reset select
    e.target.value = '';

    // Simulate bot thinking
    setTimeout(() => {
      const answer = findAnswer(selectedQuestion);
      const botMessage = {
        id: messages.length + 2,
        text: answer,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const colors = {
    light: {
      bg: '#f8f9fa',
      card: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accentBg: '#f3f4f6',
      accentText: '#6b5ff4'
    },
    dark: {
      bg: '#0f172a',
      card: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accentBg: '#1e293b',
      accentText: '#a78bfa'
    }
  };

  const isDark = theme === 'dark';
  const c = isDark ? colors.dark : colors.light;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '44px',
            width: isMobile ? '48px' : '56px',
            height: isMobile ? '48px' : '56px',
            borderRadius: '50%',
            backgroundColor: '#6b5ff4',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(107, 95, 244, 0.4)',
            zIndex: 999,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(107, 95, 244, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 95, 244, 0.4)';
          }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '120px',
            right: isMobile ? '36px' : '44px',
            left: isMobile ? '16px' : 'auto',
            width: isMobile ? 'auto' : '380px',
            maxWidth: isMobile ? 'calc(100vw - 32px)' : '380px',
            maxHeight: isMobile ? '50vh' : '600px',
            backgroundColor: c.card,
            borderRadius: '12px',
            border: `1px solid ${c.border}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#6b5ff4',
              color: 'white',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                🤖 Water Tank Assistant
              </h3>
              <p style={{ margin: 0, fontSize: '11px', opacity: 0.9 }}>
                Always here to help!
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: c.bg,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'slideIn 0.3s ease'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    lineHeight: '1.4',
                    fontSize: '13px',
                    backgroundColor: msg.sender === 'user' ? '#6b5ff4' : c.accentBg,
                    color: msg.sender === 'user' ? 'white' : c.text,
                    border: msg.sender === 'bot' ? `1px solid ${c.border}` : 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', padding: '12px 14px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: c.textSecondary,
                    animation: 'bounce 1.4s infinite'
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: c.textSecondary,
                    animation: 'bounce 1.4s infinite',
                    animationDelay: '0.2s'
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: c.textSecondary,
                    animation: 'bounce 1.4s infinite',
                    animationDelay: '0.4s'
                  }}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Select Dropdown */}
          <div
            style={{
              display: 'flex',
              padding: '12px 16px',
              borderTop: `1px solid ${c.border}`,
              backgroundColor: c.card
            }}
          >
            <select
              value=""
              onChange={handleSelectChange}
              style={{
                flex: 1,
                padding: '10px 12px',
                fontSize: '12px',
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                backgroundColor: c.bg,
                color: c.textSecondary,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">📝 Select a question...</option>
              <option value="hello">👋 Hello</option>
              <option value="help">🆘 Help</option>
              <option value="what is tank level">💧 What is tank level?</option>
              <option value="what is efficiency">⚡ What is efficiency?</option>
              <option value="what is anomaly">⚠️ What is anomaly?</option>
              <option value="what is leak risk">🚨 What is leak risk?</option>
              <option value="what is temperature">🌡️ What is temperature?</option>
              <option value="what is refill time">⏱️ What is refill time?</option>
              <option value="what is confidence">✅ What is confidence?</option>
              <option value="what is filling">💧 What is filling?</option>
              <option value="what is washing machine">🧺 What is washing machine?</option>
              <option value="what is geyser">🚿 What is geyser?</option>
              <option value="what is flushing">🚽 What is flushing?</option>
              <option value="how does it work">🔧 How does it work?</option>
              <option value="6 predictions">📊 What are 6 predictions?</option>
            </select>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default AIAssistant;
