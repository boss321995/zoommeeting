// หน้านี้สำหรับ admin calendar (แก้ไข/ลบได้)
'use client'

import React, { useEffect, useState } from 'react';
import { ZoomBooking } from '@/types/booking';
import Calendar from '@/components/Calendar';
import { DatePicker, TimePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import thTH from 'antd/locale/th_TH';
import 'antd/dist/reset.css';

const AdminCalendar: React.FC = () => {
  // ตรวจสอบ login: ถ้าไม่มี zoomMeetingUser ใน localStorage ให้ redirect ไป /logout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('zoomMeetingUser');
      if (!user) {
        window.location.href = '/logout';
      }
    }
  }, []);

  // State สำหรับ modal เพิ่ม/แก้ไข/ลบ
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ZoomBooking | null>(null);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<ZoomBooking | null>(null);

  // ปุ่มเพิ่มการจอง/แก้ไข/ลบ (modal placeholder)
  const handleAddBooking = () => {
    setSelectedBooking(null);
    setShowEditModal(true);
  };
  const handleEditBooking = (booking: ZoomBooking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };
  const handleDeleteBooking = (booking: ZoomBooking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e_id: bookingToDelete.id })
      });
      setShowDeleteModal(false);
      setBookingToDelete(null);
      setCalendarRefreshKey(k => k + 1);
    } catch {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 lg:p-8">
      {/* Header with improved styling */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-white/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ปฏิทินการจอง (Admin)
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleAddBooking} 
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                เพิ่มการจอง
              </button>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'} 
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="w-full max-w-7xl mx-auto">
        <Calendar
          key={calendarRefreshKey}
          currentUser={typeof window !== 'undefined' ? localStorage.getItem('zoomMeetingUser') || undefined : undefined}
          onRequestLogin={() => {}}
          onEditBooking={handleEditBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      </div>
      {/* Modal เพิ่ม/แก้ไข booking */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold">
                    {selectedBooking ? 'แก้ไขการจอง' : 'เพิ่มการจอง'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Form Container */}
            <div className="p-6 lg:p-8 max-h-[70vh] overflow-y-auto">
              <EditBookingForm
                booking={selectedBooking}
                onClose={() => setShowEditModal(false)}
                onSaved={() => {
                  setShowEditModal(false);
                  setSelectedBooking(null);
                  setCalendarRefreshKey(k => k + 1);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Modal ยืนยันการลบ booking */}
      {showDeleteModal && bookingToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">ยืนยันการลบ</h2>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">
                คุณต้องการลบการจอง <br />
                <span className="font-bold text-red-600 text-lg">&ldquo;{bookingToDelete.title}&rdquo;</span> <br />
                ใช่หรือไม่?
              </p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold shadow-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={confirmDeleteBooking} 
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;

// ฟอร์มแก้ไข/เพิ่ม booking (inline component)
interface EditBookingFormProps {
  booking: ZoomBooking | null;
  onClose: () => void;
  onSaved: () => void;
}

const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onClose, onSaved }) => {
  // ดึง accounts จาก API จริง
  const [accounts, setAccounts] = useState<{ a_id: string; a_name: string; a_colorCode: string; a_participant: number }[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data.accounts || []))
      .catch(() => setAccountsError('ไม่สามารถโหลดบัญชีได้'))
      .finally(() => setAccountsLoading(false));
  }, []);

  const [title, setTitle] = useState(booking?.title || '');
  const [accountId, setAccountId] = useState(booking?.accountId || '');
  const defaultStart = dayjs().hour(9).minute(0).second(0);
  const defaultEnd = dayjs().hour(16).minute(0).second(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(booking ? dayjs(booking.startTime) : dayjs());
  const [startTime, setStartTime] = useState<Dayjs | null>(booking ? dayjs(booking.startTime) : defaultStart);
  const [endDate, setEndDate] = useState<Dayjs | null>(booking ? dayjs(booking.endTime) : dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(booking ? dayjs(booking.endTime) : defaultEnd);
  const [description, setDescription] = useState(booking?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecord, setIsRecord] = useState(false);
  const [isStudio, setIsStudio] = useState(false);
  const isEdit = !!booking;

  // เมื่อเลือกบัญชี ให้เปลี่ยนชื่อบัญชีและสีใน payload ด้วย
  const selectedAccount = accounts.find(acc => acc.a_id === accountId);

  useEffect(() => {
    // ตั้งค่า accountId default เมื่อ accounts โหลดเสร็จ (เฉพาะตอนเพิ่มใหม่)
    if (!isEdit && accounts.length && !accountId) {
      setAccountId(accounts[0].a_id);
    }
  }, [accounts, isEdit, accountId]);

  // sync ค่า checkbox ทันทีเมื่อ booking เปลี่ยน (รองรับทุกกรณี 0/1/true/false/'1')
  useEffect(() => {
    if (booking) {
      setIsRecord(toBool(booking.isRecord));
      setIsStudio(toBool(booking.isStudio));
    } else {
      setIsRecord(false);
      setIsStudio(false);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (!selectedAccount) throw new Error('กรุณาเลือกบัญชี');
      if (!startDate || !startTime || !endDate || !endTime) throw new Error('กรุณาเลือกวันและเวลา');
      // รวม date+time เป็น ISO string
      const startISO = startDate.set('hour', startTime.hour()).set('minute', startTime.minute()).set('second', 0).toISOString();
      const endISO = endDate.set('hour', endTime.hour()).set('minute', endTime.minute()).set('second', 0).toISOString();
      // ปรับ payload ให้ตรงกับ backend (memo แทน description)
      const payload = isEdit
        ? {
            e_id: booking?.id,
            a_id: accountId,
            e_title: title,
            e_startDate: startISO,
            e_endDate: endISO,
            memo: description,
            isRecord,
            isStudio,
          }
        : {
            a_id: accountId,
            e_title: title,
            e_startDate: startISO,
            e_endDate: endISO,
            memo: description,
            isRecord,
            isStudio,
          };
      const res = await fetch('/api/events', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
      onSaved();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ConfigProvider locale={thTH}>
      <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-3xl shadow-xl border border-white/50">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-semibold text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-purple-700">หัวข้อ</label>
              <input 
                type="text" 
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 text-gray-700 placeholder-gray-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="ระบุหัวข้อการประชุม"
                style={{ color: '#374151' }} // text-gray-700
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-purple-700">บัญชี</label>
              {accountsLoading ? (
                <div className="flex items-center space-x-2 text-gray-500 py-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span>กำลังโหลดบัญชี...</span>
                </div>
              ) : accountsError ? (
                <div className="text-red-500 py-3">{accountsError}</div>
              ) : (
                <select
                  className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 font-semibold focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 text-gray-700"
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  style={{ background: selectedAccount?.a_colorCode, color: '#374151' }}
                  required
                >
                  {accounts.map(acc => (
                    <option key={acc.a_id} value={acc.a_id} style={{ background: acc.a_colorCode, color: '#374151' }}>
                      {acc.a_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-purple-700">วันเริ่ม</label>
                <DatePicker
                  className="w-full"
                  value={startDate}
                  onChange={setStartDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  placeholder="เลือกวันเริ่ม"
                />
                <TimePicker
                  className="w-full"
                  value={startTime}
                  onChange={setStartTime}
                  format="HH:mm"
                  allowClear={false}
                  placeholder="เลือกเวลาเริ่ม"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-purple-700">วันสิ้นสุด</label>
                <DatePicker
                  className="w-full"
                  value={endDate}
                  onChange={setEndDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  placeholder="เลือกวันสิ้นสุด"
                />
                <TimePicker
                  className="w-full"
                  value={endTime}
                  onChange={setEndTime}
                  format="HH:mm"
                  allowClear={false}
                  placeholder="เลือกเวลาสิ้นสุด"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
              <label className="block text-sm font-bold mb-3 text-purple-700">ตัวเลือกเพิ่มเติม</label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="record-checkbox"
                    checked={isRecord}
                    onChange={e => setIsRecord(e.target.checked)}
                    className="accent-purple-500 w-5 h-5 rounded focus:ring-2 focus:ring-purple-300"
                  />
                  <label htmlFor="record-checkbox" className="text-sm font-semibold text-purple-700 select-none cursor-pointer flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                    <span>Record</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="studio-checkbox"
                    checked={isStudio}
                    onChange={e => setIsStudio(e.target.checked)}
                    className="accent-blue-500 w-5 h-5 rounded focus:ring-2 focus:ring-blue-300"
                  />
                  <label htmlFor="studio-checkbox" className="text-sm font-semibold text-blue-700 select-none cursor-pointer flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="4" y="4" width="12" height="12" rx="2" />
                    </svg>
                    <span>ใช้งานห้องสตูดิโอ</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-purple-700">รายละเอียด</label>
              <textarea 
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-purple-300 resize-none text-gray-700 placeholder-gray-500" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4}
                placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                style={{ color: '#374151' }} // text-gray-700
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold shadow-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>กำลังบันทึก...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มการจอง'}</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </ConfigProvider>
  );
};

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'string') return val === '1' || val.toLowerCase() === 'true';
  return false;
}
