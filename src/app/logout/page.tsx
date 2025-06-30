"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("zoomMeetingUser");
    // redirect to home after logout
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin mx-auto mb-4">
          <div className="w-12 h-12 bg-white rounded-full m-2"></div>
        </div>
        <p className="text-xl text-gray-600 font-medium">กำลังออกจากระบบ...</p>
      </div>
    </div>
  );
}
