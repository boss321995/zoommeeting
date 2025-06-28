'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Login Component (embedded since external import might not exist)
interface LoginProps {
  onLogin: (username: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      onLogin(username);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="กรอกชื่อผู้ใช้"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          รหัสผ่าน
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="กรอกรหัสผ่าน"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}

export default function AdminPage() {
  const router = useRouter();

  const handleLogin = (username: string) => {
    console.log(`Admin logged in as: ${username}`);
    // Note: Using React state instead of localStorage for Claude.ai compatibility
    // In your actual implementation, you can use localStorage
    router.push('/');
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">
            {/* Glassmorphism Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                  {/* Animated Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
                    <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                  </div>

                  {/* Title with Gradient Text */}
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3 text-center fade-in">
                    Admin Portal
                  </h1>
                  
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mb-4 expand-width"></div>
                  
                  <p className="text-gray-300 text-center leading-relaxed">
                    <span className="block text-lg font-medium mb-1">ระบบจัดการผู้ดูแล</span>
                    <span className="block text-sm opacity-80">เข้าสู่ระบบเพื่อจัดการการจอง Zoom Meeting</span>
                  </p>
                </div>

                {/* Login Component Container */}
                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 shadow-lg">
                    <Login onLogin={handleLogin} />
                  </div>
                  {/* Additional Security Info */}
                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>การเชื่อมต่อปลอดภัยด้วย SSL</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                © 2025 Zoom Meeting Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 6rem; }
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .expand-width {
          animation: expandWidth 1s ease-out 0.5s both;
        }
      `}</style>
    </>
  );
}