'use client'

import { useRouter } from 'next/navigation';
import Login from '@/components/Login';

export default function AdminPage() {
  const router = useRouter();

  const handleLogin = (username: string) => {
    console.log(`Admin logged in as: ${username}`);
    localStorage.setItem('zoomMeetingUser', username);
    localStorage.setItem('isAdmin', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Admin Login</h1>
          <p className="text-gray-500 text-center">เข้าสู่ระบบสำหรับผู้ดูแลระบบ<br/>เพื่อจัดการการจอง Zoom Meeting</p>
        </div>
        <Login onLogin={handleLogin} />
      </div>
    </div>
  );
}
