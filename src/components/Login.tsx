"use client";

import React, { useState, useEffect } from "react";

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);

  // โหลดข้อมูลที่จำไว้เมื่อเปิดหน้า
  useEffect(() => {
    const savedUsername = sessionStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
    
    // แสดง quick login หลังจาก 1 วินาที
    const timer = setTimeout(() => {
      setShowQuickLogin(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้");
      return;
    }
    
    if (username.trim().length < 3) {
      setError("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    // จำหรือลืม username ตาม checkbox
    if (rememberMe) {
      sessionStorage.setItem("rememberedUsername", username.trim());
    } else {
      sessionStorage.removeItem("rememberedUsername");
    }
    
    // จำลอง loading และ login
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username.trim());
      // ถ้าเป็น admin ให้ redirect ไปหน้า admin/calendar
      if (username.trim().toLowerCase() === 'admin') {
        window.location.href = '/admin/calendar';
      }
    }, 1200);
  };

  // Quick login suggestions
  const quickUsers = [
    { name: "admin", label: "ผู้ดูแลระบบ", icon: "👑" },
    { name: "user", label: "ผู้ใช้ทั่วไป", icon: "👤" },
    { name: "guest", label: "ผู้เยี่ยมชม", icon: "🎭" }
  ];
  
  const handleQuickLogin = (user: string) => {
    setUsername(user);
    setError("");
    // เพิ่ม haptic feedback simulation
    navigator.vibrate?.(50);
  };

  const clearError = () => {
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 via-pink-50 to-cyan-100 p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full animate-fadeIn hover:shadow-3xl transition-all duration-500"
        >
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              ยินดีต้อนรับ
            </h2>
            <p className="text-gray-600 font-medium">ระบบจอง Zoom Meeting</p>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto mt-3"></div>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">ชื่อผู้ใช้</label>
            <div className="relative group">
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                className={`w-full px-4 py-4 pl-14 rounded-2xl border-2 transition-all duration-300 text-lg font-medium ${
                  isFocused 
                    ? 'border-purple-400 bg-purple-50/50 shadow-lg scale-105' 
                    : error 
                      ? 'border-red-400 bg-red-50/50' 
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                } focus:outline-none focus:ring-4 focus:ring-purple-400/20`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
              />
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                isFocused ? 'text-purple-500 scale-110' : 'text-gray-400'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {username && !error && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-fadeIn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {username && (
              <div className="mt-2 text-xs text-gray-500 animate-fadeIn">
                ตัวอักษร: {username.length} {username.length >= 3 ? '✅' : '(ต้องการอย่างน้อย 3 ตัว)'}
              </div>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
                rememberMe 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 shadow-lg' 
                  : 'border-gray-300 hover:border-purple-400 group-hover:bg-purple-50'
              }`}>
                {rememberMe && (
                  <svg className="w-4 h-4 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700 font-medium select-none group-hover:text-purple-600 transition-colors">
                จำชื่อผู้ใช้ในเซสชันนี้
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform shadow-xl text-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed scale-95'
                : !username.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-2xl active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                <span className="animate-pulse">กำลังเข้าสู่ระบบ...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                เข้าสู่ระบบ
              </div>
            )}
          </button>
        </form>

        {/* Quick Login */}
        {showQuickLogin && (
          <div className="mt-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 animate-slideUp">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🚀 เข้าสู่ระบบด่วน</h3>
              <p className="text-sm text-gray-600">เลือกบัญชีทดสอบเพื่อเข้าใช้งานได้ทันที</p>
            </div>
            
            <div className="space-y-3">
              {quickUsers.map((user, index) => (
                <button
                  key={user.name}
                  onClick={() => handleQuickLogin(user.name)}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-xl text-left font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-200 hover:border-purple-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <span className="text-2xl mr-4 animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                    {user.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.label}</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>💡 ทิป: กด Tab เพื่อนำทางด้วยคีย์บอร์ด</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
          100% { transform: scale(1) rotate(45deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-checkmark { animation: checkmark 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .border-3 { border-width: 3px; }
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default Login;