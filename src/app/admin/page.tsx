'use client'

import { useState, useEffect } from 'react';

// Login Component (embedded since external import might not exist)
interface LoginProps {
  onLogin: (username: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ดึง allowedUsers จาก API/database
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  useEffect(() => {
    fetch('/api/admin-users')
      .then(res => res.json())
      .then(data => setAllowedUsers(data.users || []));
  }, []);

  // Load remembered username from localStorage
  useEffect(() => {
    const remembered = localStorage.getItem('rememberedUsername');
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      // ตรวจสอบ username จาก allowedUsers ที่ดึงมาจากฐานข้อมูล
      if (allowedUsers.includes(username)) {
        onLogin(username);
        // redirect ไป admin/calendar
        window.location.href = '/admin/calendar';
      } else {
        alert('ไม่พบชื่อผู้ใช้นี้ในระบบ');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="กรอกชื่อผู้ใช้"
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 select-none">
          Remember me
        </label>
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
  const [user, setUser] = useState<string | null>(null);
  const [checked, setChecked] = useState(false); // เพิ่ม state สำหรับเช็ค login

  useEffect(() => {
    const savedUser = localStorage.getItem('zoomMeetingUser');
    if (savedUser) setUser(savedUser);
    setChecked(true); // รอเช็คเสร็จค่อย render
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('zoomMeetingUser', username);
    // router.push('/'); // ไม่ต้อง redirect หลัง login ที่นี่
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('zoomMeetingUser');
      if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนใช้งานเมนูผู้ดูแลระบบ');
        window.location.href = '/admin';
      }
    }
  }, []);

  // ถ้ายังไม่ได้เช็ค login (hydration) ให้ return null
  if (!checked) return null;

  // ถ้ายังไม่ได้ login ให้แสดง login ก่อน
  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          {/* Floating Elements (white/purple theme) */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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
                  
                  <p className="text-gray-700 text-center leading-relaxed">
                    <span className="block text-lg font-medium mb-1">ระบบจัดการผู้ดูแล</span>
                    <span className="block text-sm opacity-80">เข้าสู่ระบบเพื่อจัดการการจอง Zoom Meeting</span>
                  </p>
                </div>

                {/* Login Component Container */}
                <div className="space-y-6">
                  <div className="rounded-xl bg-white/80 p-6 shadow-lg">
                    <Login onLogin={handleLogin} />
                  </div>
                  {/* System Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-4 shadow">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-medium text-gray-700">ความปลอดภัยสูงด้วย SSL</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4 shadow">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
                      </svg>
                      <span className="font-medium text-purple-700">จัดการจอง Zoom ได้ง่าย</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-100 to-pink-50 rounded-lg p-4 shadow">
                      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-pink-700">อนุมัติ/ยกเลิกการจองได้ทันที</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 shadow">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a1 1 0 001 1h3m10-5h2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2v-2" />
                      </svg>
                      <span className="font-medium text-green-700">ดูสถิติและประวัติย้อนหลัง</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm font-medium">
                © 2025 Zoom Meeting Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ถ้า login แล้ว redirect ไปหน้า admin/calendar
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/calendar';
    }
    return null;
  }
}

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