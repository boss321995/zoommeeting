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

  // โหลดข้อมูลที่จำไว้เมื่อเปิดหน้า
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    // จำหรือลืม username ตาม checkbox
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username.trim());
    } else {
      localStorage.removeItem("rememberedUsername");
    }
    
    // จำลอง loading และ login
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username.trim());
    }, 800);
  };

  // Quick login suggestions
  const quickUsers = ["admin", "user", "guest"];
  
  const handleQuickLogin = (user: string) => {
    setUsername(user);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full animate-fadeIn"
        >
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              เข้าสู่ระบบ
            </h2>
            <p className="text-gray-500 mt-2">ระบบจอง Zoom Meeting</p>
          </div>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <div className="relative">
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                rememberMe 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600 select-none">จำชื่อผู้ใช้</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform shadow-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังเข้าสู่ระบบ...
              </div>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        {/* Quick Login */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">เข้าสู่ระบบด่วน</h3>
          <div className="flex justify-center space-x-3">
            {quickUsers.map((user) => (
              <button
                key={user}
                onClick={() => handleQuickLogin(user)}
                className="px-4 py-2 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                {user}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">คลิกเพื่อเลือกผู้ใช้ทดสอบ</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
