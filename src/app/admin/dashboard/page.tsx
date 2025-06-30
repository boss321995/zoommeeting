"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// กำหนด type ให้ตรงกับ schema

interface Event {
  e_id: number;
  e_title: string;
  e_startDate: string;
  e_endDate: string;
  a_id: string;
  memo: string;
}

interface UsageByAccount {
  [a_id: string]: {
    a_name: string;
    count: number;
    hours: number;
  };
}

// helper สำหรับแปลงชั่วโมงทศนิยมเป็น ชม. นาที
function formatHoursToHM(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} ชม. ${m} นาที`;
}

function exportToExcel(events: Event[], accountName: string) {
  const wsData = [
    ["ชื่อการประชุม", "วันเริ่ม", "วันจบ"],
    ...events.map(ev => [
      ev.e_title,
      new Date(ev.e_startDate).toLocaleString(),
      new Date(ev.e_endDate).toLocaleString()
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Events");
  XLSX.writeFile(wb, `${accountName || "account"}_events.xlsx`);
}

// เพิ่ม CSS สำหรับ print เฉพาะ modal
const printModalStyle = `
@media print {
  body * { visibility: hidden !important; }
  #print-modal, #print-modal * { visibility: visible !important; }
  #print-modal {
    position: fixed !important;
    left: 0; top: 0; width: 100vw; height: 100vh !important;
    background: white !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 0 !important;
    max-height: none !important;
    border-radius: 0 !important;
    display: block !important;
    overflow: visible !important;
  }
  #print-modal > div {
    box-shadow: none !important;
    background: white !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
  #print-modal .no-print, #print-modal .modal-header, #print-modal .modal-footer { display: none !important; }
  #print-modal .print-table { margin-top: 0 !important; }
  #print-modal .rounded-2xl, #print-modal .shadow-lg, #print-modal .overflow-hidden { border-radius: 0 !important; box-shadow: none !important; overflow: visible !important; }
  #print-modal table { width: 100% !important; font-size: 1rem !important; }
  #print-modal th, #print-modal td { padding: 8px 12px !important; }
}
`;

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [summary, setSummary] = useState<{
    totalEventsThisYear: number;
    totalHours: number;
    usageByAccount: UsageByAccount;
  } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // เตรียมข้อมูลกราฟจำนวนงานแต่ละเดือน (ปีนี้)
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events);
        setSummary(data.summary);
      });
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const year = new Date().getFullYear();
      const counts = Array(12).fill(0);
      events.forEach(e => {
        const d = new Date(e.e_startDate);
        if (d.getFullYear() === year) {
          counts[d.getMonth()]++;
        }
      });
      setMonthlyData(counts);
    }
  }, [events]);

  // redirect ถ้าไม่ได้ login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("zoomMeetingUser");
      if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อนใช้งานเมนูผู้ดูแลระบบ');
        window.location.href = '/admin';
      }
    }
  }, []);

  // ฟิลเตอร์งานของ account ที่เลือก (ปีนี้)
  const year = new Date().getFullYear();
  const filteredEvents = selectedAccount && events.length > 0
    ? events.filter(e => e.a_id === selectedAccount && new Date(e.e_startDate).getFullYear() === year)
    : [];
  const accountName = selectedAccount && summary ? summary.usageByAccount[selectedAccount]?.a_name : "";

  return (
    <>
      <style>{printModalStyle}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 lg:p-8">
        {/* Header with improved styling */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-white/50">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard รายงานสถิติ
                </h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => (window.location.href = "/admin/calendar")}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  ปฏิทินการจอง
                </button>
               
              </div>
            </div>
          </div>
        </div>
        {/* Summary Section */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-all duration-300">
                <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-4xl lg:text-5xl font-bold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                  {summary ? summary.totalEventsThisYear : "-"}
                </span>
                <span className="text-gray-700 font-medium text-sm lg:text-base">จำนวนงานทั้งหมดประจำปีนี้</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-green-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-all duration-300">
                <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <span className="text-4xl lg:text-5xl font-bold text-green-600 mb-3 group-hover:text-green-700 transition-colors">
                  {summary ? formatHoursToHM(summary.totalHours) : "-"}
                </span>
                <span className="text-gray-700 font-medium text-sm lg:text-base">จำนวนชั่วโมงที่ใช้ประชุม (ปีนี้)</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-pink-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-all duration-300">
                <svg className="w-20 h-20 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl mb-4 shadow-lg group-hover:from-pink-600 group-hover:to-pink-700 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                </div>
                <span className="text-4xl lg:text-5xl font-bold text-pink-600 mb-3 group-hover:text-pink-700 transition-colors">
                  {events.length}
                </span>
                <span className="text-gray-700 font-medium text-sm lg:text-base">จำนวนการจองทั้งหมด (ทุกปี)</span>
              </div>
            </div>
          </div>
        </div>
        {/* Usage by Account Table */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-purple-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                ข้อมูลการใช้งานแยกตามบัญชี Zoom (ปีนี้)
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-purple-100 shadow-lg">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 to-purple-200">
                    <th className="py-4 px-6 font-bold text-purple-800 text-sm lg:text-base">บัญชี Zoom</th>
                    <th className="py-4 px-6 font-bold text-purple-800 text-sm lg:text-base">จำนวนงาน</th>
                    <th className="py-4 px-6 font-bold text-purple-800 text-sm lg:text-base">ชั่วโมงประชุม</th>
                  </tr>
                </thead>
                <tbody>
                  {summary && Object.entries(summary.usageByAccount).map(([a_id, usage], index) => (
                    <tr key={a_id} className={`hover:bg-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'}`}>
                      <td className="py-4 px-6 text-purple-700 cursor-pointer font-semibold hover:text-purple-900 hover:underline transition-all duration-200 text-sm lg:text-base" 
                          onClick={() => { setSelectedAccount(a_id); setShowModal(true); }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{usage.a_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium text-sm lg:text-base">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {usage.count} งาน
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium text-sm lg:text-base">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {formatHoursToHM(usage.hours)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Heartbeat Line Chart */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8 border border-pink-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                จำนวนงานแต่ละเดือน (ปี {new Date().getFullYear()})
              </h2>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 lg:p-6">
              <Line
                data={{
                  labels: [
                    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
                  ],
                  datasets: [
                    {
                      label: "จำนวนงาน",
                      data: monthlyData,
                      borderColor: "#e11d48",
                      backgroundColor: "rgba(225,29,72,0.1)",
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointBackgroundColor: "#e11d48",
                      pointBorderColor: "#ffffff",
                      pointBorderWidth: 3,
                      borderWidth: 4,
                      pointHoverRadius: 8,
                      pointHoverBackgroundColor: "#be185d",
                      pointHoverBorderColor: "#ffffff",
                      pointHoverBorderWidth: 3,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      display: true,
                      position: 'top',
                      labels: {
                        font: {
                          size: 14,
                          weight: 'bold'
                        },
                        color: '#be185d',
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    title: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#be185d',
                      bodyColor: '#374151',
                      borderColor: '#e11d48',
                      borderWidth: 2,
                      cornerRadius: 12,
                      displayColors: false,
                      titleFont: {
                        size: 14,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 13
                      }
                    }
                  },
                  scales: {
                    y: { 
                      beginAtZero: true, 
                      ticks: { 
                        stepSize: 1,
                        color: '#6b7280',
                        font: {
                          size: 12,
                          weight: 500
                        }
                      },
                      grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                      }
                    },
                    x: {
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 12,
                          weight: 500
                        }
                      },
                      grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
                height={140}
              />
            </div>
          </div>
        </div>
        {/* Modal */}
        {showModal && (
          <div id="print-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-6 lg:p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white modal-header">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold">งานของบัญชี: {accountName}</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 no-print"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 p-6 bg-gray-50 no-print modal-footer">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  พิมพ์
                </button>
                <button
                  onClick={() => exportToExcel(filteredEvents, accountName)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-green-500 text-white font-semibold shadow-lg hover:from-yellow-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ดาวน์โหลด Excel
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-6 print-table">
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                        <th className="py-4 px-6 font-bold text-purple-800">ชื่อการประชุม</th>
                        <th className="py-4 px-6 font-bold text-purple-800">วันเริ่ม</th>
                        <th className="py-4 px-6 font-bold text-purple-800">วันจบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center space-y-3">
                              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-lg font-medium">ไม่พบข้อมูล</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((ev, index) => (
                          <tr key={ev.e_id} className={`hover:bg-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-4 px-6 text-gray-800 font-medium">{ev.e_title}</td>
                            <td className="py-4 px-6 text-gray-600">{new Date(ev.e_startDate).toLocaleString()}</td>
                            <td className="py-4 px-6 text-gray-600">{new Date(ev.e_endDate).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end p-6 bg-gray-50 no-print modal-footer">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
