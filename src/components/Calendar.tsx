'use client'

import React, { useEffect, useState } from 'react';
import { ZoomBooking, CalendarDay } from '@/types/booking';

interface CalendarProps {
  onLogout?: () => void;
  currentUser?: string;
  onRequestLogin?: () => void; // เพิ่ม prop สำหรับเรียก login modal
}

const Calendar: React.FC<CalendarProps> = ({ onLogout, currentUser, onRequestLogin }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ZoomBooking | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<ZoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getCalendarDays = (): CalendarDay[] => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      // Multi-day event support: booking อยู่ในวันไหนถ้า current อยู่ในช่วง start-end
      const dayBookings = bookings.filter(booking => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        // set end to 23:59:59 for all-day/multi-day
        end.setHours(23,59,59,999);
        return current >= start && current <= end;
      });

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === currentDate.getMonth(),
        bookings: dayBookings
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setIsTransitioning(false);
    }, 150);
  };

  const goToNextMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setIsTransitioning(false);
    }, 150);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-sm';
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 shadow-sm';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-sm';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 shadow-sm';
    }
  };

  const calendarDays = getCalendarDays();

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!events || events.length === 0) return;
    const mapped: ZoomBooking[] = events.map(ev => ({
      id: String(ev.e_id),
      title: ev.e_title || 'ไม่ระบุหัวข้อ',
      accountName: ev.a_name || 'ไม่ระบุ',
      accountId: ev.a_id,
      startTime: new Date(ev.e_startDate),
      endTime: new Date(ev.e_endDate),
      description: ev.memo,
      organizer: '', // เพิ่ม logic ถ้าต้องการ
      participants: ev.a_participant || 0,
      status: 'confirmed', // หรือ logic อื่น
      meetingUrl: '', // เพิ่ม logic ถ้ามี
      color: ev.a_colorCode,
    }));
    setBookings(mapped);
  }, [events]);

  // Helper: เช็คว่าวันนี้เป็นวันเริ่มต้นของ booking หรือไม่
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();



  // Helper: คำนวณตำแหน่งและขนาดของ event bar ในสัปดาห์
  const getBookingPosition = (booking: ZoomBooking, weekStart: Date) => {
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);
    
    // หาวันเริ่มต้นและสิ้นสุดในสัปดาห์นี้
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const effectiveStart = startDate < weekStart ? weekStart : startDate;
    const effectiveEnd = endDate > weekEnd ? weekEnd : endDate;
    
    // คำนวณ position และ width เป็น %
    const startDay = Math.floor((effectiveStart.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    const endDay = Math.floor((effectiveEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    
    const left = (startDay / 7) * 100;
    const width = ((endDay - startDay + 1) / 7) * 100;
    
    return { left, width, startDay, endDay };
  };

  // จัดกลุ่ม bookings ตาม row ให้ไม่ทับซ้อนกัน (ใช้ฟังก์ชัน getBookingPosition ใหม่)
  const arrangeBookingsInWeekRows = (weekBookings: ZoomBooking[], weekStart: Date) => {
    const rows: ZoomBooking[][] = [];
    
    weekBookings.forEach(booking => {
      const { startDay, endDay } = getBookingPosition(booking, weekStart);
      
      // หา row ที่ไม่ทับซ้อน
      let targetRow = -1;
      for (let i = 0; i < rows.length; i++) {
        const hasOverlap = rows[i].some(existingBooking => {
          const existing = getBookingPosition(existingBooking, weekStart);
          return !(endDay < existing.startDay || startDay > existing.endDay);
        });
        
        if (!hasOverlap) {
          targetRow = i;
          break;
        }
      }
      
      // ถ้าไม่มี row ที่เหมาะสม ให้สร้าง row ใหม่
      if (targetRow === -1) {
        rows.push([booking]);
      } else {
        rows[targetRow].push(booking);
      }
    });
    
    return rows;
  };

  // คำนวณสถิติ
  const getMonthStats = () => {
    const currentMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.getMonth() === currentDate.getMonth() && 
             bookingDate.getFullYear() === currentDate.getFullYear();
    });

    const todayBookings = bookings.filter(booking => {
      const today = new Date();
      const bookingDate = new Date(booking.startTime);
      return isSameDay(today, bookingDate);
    });

    const upcomingBookings = bookings.filter(booking => {
      const today = new Date();
      const bookingDate = new Date(booking.startTime);
      return bookingDate > today;
    });

    const confirmedBookings = currentMonthBookings.filter(b => b.status === 'confirmed');
    const pendingBookings = currentMonthBookings.filter(b => b.status === 'pending');
    const totalParticipants = currentMonthBookings.reduce((sum, b) => sum + b.participants, 0);

    return {
      totalThisMonth: currentMonthBookings.length,
      todayCount: todayBookings.length,
      upcomingCount: upcomingBookings.length,
      confirmedCount: confirmedBookings.length,
      pendingCount: pendingBookings.length,
      totalParticipants
    };
  };

  const monthStats = getMonthStats();

  // Helper: หา bookings ทั้งหมดที่อยู่ในวัน date (normalize เวลา)
  const getBookingsForDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return bookings.filter(booking => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return d >= start && d <= end;
    });
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4 animate-fadeIn">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ตารางการจอง Zoom Meeting
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl shadow-lg p-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 hover:from-blue-400 hover:to-purple-400 hover:text-white font-semibold shadow transition-all duration-300"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2" />
            </svg>
            วันนี้
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={goToPreviousMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className={`text-xl lg:text-2xl font-semibold min-w-[180px] lg:min-w-[220px] text-center text-gray-800 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-slideUp">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{isLoading ? '...' : monthStats.totalThisMonth}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">การจองเดือนนี้</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{isLoading ? '...' : monthStats.todayCount}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">การจองวันนี้</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">{isLoading ? '...' : monthStats.upcomingCount}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">การจองที่จะมาถึง</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">{isLoading ? '...' : monthStats.confirmedCount}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">ยืนยันแล้ว</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl group-hover:from-yellow-600 group-hover:to-yellow-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors">{isLoading ? '...' : monthStats.pendingCount}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">รอยืนยัน</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 group transform hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{isLoading ? '...' : monthStats.totalParticipants}</div>
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">ผู้เข้าร่วมทั้งหมด</div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 animate-pulse">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin">
              <div className="w-6 h-6 bg-white rounded-full m-1"></div>
            </div>
            <div className="text-xl text-gray-600 font-medium">กำลังโหลดข้อมูลการจอง...</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({length: 35}).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {!isLoading && (
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform ${isTransitioning ? 'scale-95 opacity-75' : 'scale-100 opacity-100'} animate-slideUp`}>
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          {dayNames.map((day, index) => (
            <div key={day} className={`p-6 text-center font-semibold text-xl animate-fadeIn`} style={{animationDelay: `${index * 50}ms`}}>
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Days (with absolute positioned events) */}
        <div className="relative">
          {(() => {
            // แบ่ง days เป็นสัปดาห์
            const weeks: CalendarDay[][] = [];
            let week: CalendarDay[] = [];
            calendarDays.forEach((day) => {
              week.push(day);
              if (week.length === 7) {
                weeks.push(week);
                week = [];
              }
            });
            if (week.length) weeks.push(week);
            
            return weeks.map((weekDays, weekIdx) => (
              <div key={weekIdx} className="relative">
                {/* Day cells แบบธรรมดา */}
                <div className="grid grid-cols-7 relative">
                  {weekDays.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`relative min-h-[140px] border-b border-r border-gray-100 p-3 cursor-pointer transition-all duration-300 hover:z-10 ${
                        !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
                      } ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-gradient-to-br from-blue-100 to-purple-100 shadow-inner ring-2 ring-blue-300' : ''}`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold ${day.date.toDateString() === new Date().toDateString() ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse border-2 border-white' : ''}`}>
                          {day.date.getDate()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Event bars แบบ absolute positioned */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {(() => {
                    // หา bookings ที่เริ่มในสัปดาห์นี้
                    const weekBookings = bookings.filter(booking => {
                      const startDate = new Date(booking.startTime);
                      return weekDays.some(day => isSameDay(day.date, startDate));
                    });
                    
                    // จัดเรียง bookings เป็น rows
                    const weekStart = weekDays[0].date;
                    const bookingRows = arrangeBookingsInWeekRows(weekBookings, weekStart);
                    
                    return bookingRows.map((row, rowIdx) => (
                      <div key={rowIdx} className="absolute w-full" style={{ top: `${36 + rowIdx * 32}px` }}>
                        {row.map(booking => {
                          const position = getBookingPosition(booking, weekStart);
                          return (
                          <div
                            key={booking.id}
                            className="absolute h-7 rounded-lg flex items-center text-xs font-bold px-3 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/70 pointer-events-auto"
                            style={{
                              left: `${position.left}%`,
                              width: `${position.width}%`,
                              background: booking.color || '#3B82F6',
                              color: '#fff',
                              zIndex: 20 + rowIdx
                            }}
                            title={`${booking.title} (${formatTime(booking.startTime)} - ${formatTime(booking.endTime)})`}
                            onClick={e => { e.stopPropagation(); setSelectedBooking(booking); }}
                          >
                            <span className="w-2 h-2 rounded-full mr-2 border border-white shadow" style={{background: booking.color || '#3B82F6'}}></span>
                            <span className="truncate drop-shadow-lg flex-1">{booking.title}</span>
                            <span className="ml-2 text-[10px] font-normal opacity-90">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                            
                            {/* Tooltip */}
                            <div className="absolute left-1/2 top-full mt-2 z-50 hidden hover:block min-w-[200px] transform -translate-x-1/2">
                              <div className="bg-white text-gray-800 rounded-xl shadow-xl p-4 text-xs font-medium border border-blue-100 animate-fadeIn">
                                <div className="font-bold text-sm mb-2 text-blue-700">{booking.title}</div>
                                <div className="space-y-1">
                                  <div>Account: <span className="font-semibold text-blue-600">{booking.accountName}</span></div>
                                  <div>เวลา: {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                                  <div>วันที่: {new Date(booking.startTime).toLocaleDateString('th-TH')} - {new Date(booking.endTime).toLocaleDateString('th-TH')}</div>
                                  {booking.description && <div className="mt-2 text-gray-500">{booking.description}</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
      )}

      {/* Empty State */}
      {!isLoading && bookings.length === 0 && (
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-slideUp">
          <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl inline-block mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">ไม่มีการจองในขณะนี้</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">ยังไม่มีการจอง Zoom Meeting ในระบบ คุณสามารถเริ่มต้นจองได้ตามต้องการ</p>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => {
              if (!currentUser && onRequestLogin) { onRequestLogin(); return; }
              
              // TODO: โค้ดสำหรับเริ่มต้นการจองใหม่
            }}
          >
            เริ่มต้นจอง
          </button>
        </div>
      )}

      {/* Selected Date Details */}
      {selectedDate && !isLoading && (
        <div className="mt-8 bg-gradient-to-r from-white to-blue-50/30 rounded-3xl shadow-2xl p-8 animate-slideUp border border-blue-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                การจองวันที่ {selectedDate.toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                <span className="ml-3 text-lg font-medium text-blue-700">({getBookingsForDate(selectedDate).length} งาน)</span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-3 rounded-xl bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {getBookingsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl inline-block mb-6 shadow-lg">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xl text-gray-500 font-medium mb-2">ไม่มีการจองในวันนี้</p>
              <p className="text-gray-400">วันนี้ว่างสำหรับการจองใหม่</p>
              <button
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => {
                  if (!currentUser && onRequestLogin) { onRequestLogin(); return; }
                  
                  // TODO: โค้ดสำหรับสร้างการจองใหม่
                }}
              >
                + สร้างการจองใหม่
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {getBookingsForDate(selectedDate).map((booking, index) => (
                <div 
                  key={booking.id} 
                  className={`relative overflow-hidden border-2 rounded-3xl p-6 transition-all duration-500 transform hover:scale-102 hover:shadow-2xl cursor-pointer animate-slideIn group ${getStatusColor(booking.status)}`}
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => setSelectedBooking(booking)}
                >
                  {/* Account Color Indicator */}
                  <div 
                    className="absolute top-0 left-0 w-2 h-full rounded-l-3xl"
                    style={{background: booking.color || '#3B82F6'}}
                  ></div>
                  
                  <div className="flex justify-between items-start mb-4 ml-4">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-lg mt-1"
                        style={{background: booking.color || '#3B82F6'}}
                      ></div>
                      <div>
                        <h4 className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">{booking.title}</h4>
                        <p className="text-sm text-gray-600 font-medium">{booking.accountName}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(booking.status)}`}>
                        {booking.status === 'confirmed' ? '✅ ยืนยันแล้ว' : 
                         booking.status === 'pending' ? '⏳ รอยืนยัน' : '❌ ยกเลิก'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Account</p>
                          <p className="font-semibold">{booking.accountName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">เวลา</p>
                          <p className="font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">ผู้จัด</p>
                          <p className="font-semibold">{booking.organizer}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">ผู้เข้าร่วม</p>
                          <p className="font-semibold">{booking.participants} คน</p>
                        </div>
                      </div>
                      
                      {booking.description && (
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">รายละเอียด</p>
                            <p className="font-medium">{booking.description}</p>
                          </div>
                        </div>
                      )}
                      
                      {booking.meetingUrl && (
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">ลิงก์ประชุม</p>
                            <a 
                              href={booking.meetingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              <span>เข้าร่วมประชุม</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 transform animate-scaleIn shadow-2xl border border-blue-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedBooking.title}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${getStatusColor(selectedBooking.status)} shadow-md border border-white/80`}>
                <h4 className="font-bold text-lg mb-2">รายละเอียดการจอง</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Account:</strong> {selectedBooking.accountName}</p>
                  <p><strong>ผู้จัด:</strong> {selectedBooking.organizer}</p>
                  <p><strong>เวลา:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</p>
                  <p><strong>ความจุสูงสุดของบัญชี:</strong> {selectedBooking.participants} คน</p>
                </div>
                {selectedBooking.description && (
                  <p className="mt-3"><strong>รายละเอียด:</strong> {selectedBooking.description}</p>
                )}
                {selectedBooking.meetingUrl && (
                  <div className="mt-4">
                    <a 
                      href={selectedBooking.meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span>เข้าร่วมประชุม Zoom</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
