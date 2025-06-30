'use client'

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import Login from '@/components/Login';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('zoomMeetingUser');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('zoomMeetingUser', username);
    setShowLogin(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin mx-auto mb-4">
            <div className="w-12 h-12 bg-white rounded-full m-2"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Show login modal only if user clicks login (for edit/add/delete)
  if (showLogin && !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Calendar always visible as index page */}
      <Calendar
        currentUser={user || undefined}
      />
    </div>
  );
}
