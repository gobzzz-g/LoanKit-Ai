import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import SupportChatBot from './components/SupportChatBot';
import './App.css';

function App() {
  // Initialize authState based on presence of session token (faster initial load)
  const [authState, setAuthState] = useState(() => {
    return localStorage.getItem('sessionToken') ? 'loading' : 'login';
  });
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // landing, dashboard, chat
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');

      // If no token, show login immediately without async operations
      if (!token) {
        setAuthState('login');
        return;
      }

      // Token exists, verify with backend
      try {
        // Verify session with backend and fetch fresh user data
        const { authAPI } = await import('./services/api');
        const data = await authAPI.getCurrentUser(token);

        if (data.success) {
          // Always use fresh data from server, including updated loan history
          setUser(data.user);
          setSessionToken(token);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(data.user));
          setAuthState('authenticated');
        } else {
          // Session expired or invalid
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('user');
          setAuthState('login');
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('user');
        setAuthState('login');
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setSessionToken(token);
    setAuthState('authenticated');
  };

  const handleSignupSuccess = (userData) => {
    // After signup, switch to login
    setAuthState('login');
  };

  const handleLogout = async () => {
    try {
      const { authAPI } = await import('./services/api');
      await authAPI.logout(sessionToken);
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear local storage and reset state
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    setUser(null);
    setSessionToken(null);
    setSessionStarted(false);
    setSessionData(null);
    setAuthState('login');
  };

  const handleStartSession = async (data) => {
    // If no data provided, start fresh conversation
    if (!data || !data.session) {
      try {
        const { chatAPI } = await import('./services/api');
        const result = await chatAPI.startSession(user?.customerId, user?.name);
        if (result.success) {
          setSessionData(result);
          setSessionStarted(true);
          setCurrentView('chat');
        } else {
          console.error('Failed to start session:', result.error);
          alert('Failed to start chat session. Please try again.');
        }
      } catch (error) {
        console.error('Failed to start session:', error);
        alert('Failed to connect to server. Please check your connection.');
      }
    } else {
      setSessionData(data);
      setSessionStarted(true);
      setCurrentView('chat');
    }
  };

  const handleBackToLanding = async () => {
    // Refresh user data to get latest loan history before going back
    try {
      const { authAPI } = await import('./services/api');
      const data = await authAPI.getCurrentUser(sessionToken);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
    setSessionStarted(false);
    setSessionData(null);
    setCurrentView('landing');
  };

  const handleGoToDashboard = async () => {
    // Refresh user data to get latest loan history
    console.log('📂 Opening dashboard, refreshing user data...');
    setCurrentView('dashboard'); // Set view immediately for faster navigation
    try {
      const { authAPI } = await import('./services/api');
      const data = await authAPI.getCurrentUser(sessionToken);
      console.log('📊 Dashboard data received:', data);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Dashboard showing', data.user?.loanHistory?.length, 'loans');
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleBackFromDashboard = () => {
    setCurrentView('landing');
  };

  const handleLoanDecision = async (decision) => {
    // Refresh user data immediately when a loan decision is made
    console.log('🔄 Refreshing user data after loan decision:', decision);
    try {
      const { authAPI } = await import('./services/api');
      const data = await authAPI.getCurrentUser(sessionToken);
      console.log('📊 Received updated user data:', data);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ User state updated. Loan history count:', data.user?.loanHistory?.length);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data after loan decision:', error);
    }
  };

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page
  if (authState === 'login') {
    return (
      <>
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthState('signup')}
        />
        <SupportChatBot />
      </>
    );
  }

  // Signup page
  if (authState === 'signup') {
    return (
      <>
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthState('login')}
        />
        <SupportChatBot />
      </>
    );
  }

  // Authenticated - Show Landing, Dashboard, or Chat
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
        {currentView === 'landing' && (
          <LandingPage 
            onStartSession={handleStartSession}
            onGoToDashboard={handleGoToDashboard}
            user={user}
            onLogout={handleLogout}
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard
            key={`dashboard-${user?.loanHistory?.length || 0}`}
            user={user}
            onStartNewApplication={handleStartSession}
            onBack={handleBackFromDashboard}
            onViewLoan={(loan) => console.log('View loan:', loan)}
            onUserUpdate={handleUserUpdate}
          />
        )}
        
        {currentView === 'chat' && (
          <ChatInterface 
            sessionData={sessionData} 
            onBack={handleBackToLanding}
            user={user}
            sessionToken={sessionToken}
            onLoanDecision={handleLoanDecision}
          />
        )}
      </div>
      <SupportChatBot />
    </>
  );
}

export default App;
