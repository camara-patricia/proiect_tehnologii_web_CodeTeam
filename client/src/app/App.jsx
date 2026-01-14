import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { LoginForm } from '@/app/components/auth/LoginForm';
import { RegisterForm } from '@/app/components/auth/RegisterForm';
import { EventPlannerDashboard } from '@/app/components/event-planner/EventPlannerDashboard';
import { UserDashboard } from '@/app/components/user/UserDashboard';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {showRegister ? (
        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

function AppContent() {
  const { user, loading, isEventPlanner } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return isEventPlanner ? <EventPlannerDashboard /> : <UserDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
