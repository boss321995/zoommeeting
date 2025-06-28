import { ZoomBooking } from '@/types/booking';

export const sampleBookings: ZoomBooking[] = [
  {
    id: '1',
    title: 'ประชุมทีมพัฒนา',
    accountName: 'Zoom Pro Account #1',
    accountId: 'zoom-pro-001',
    startTime: new Date(2025, 5, 30, 9, 0), // 30 มิถุนายน 2025, 9:00
    endTime: new Date(2025, 5, 30, 10, 30),
    description: 'ประชุมรายสัปดาห์ของทีมพัฒนาระบบ',
    organizer: 'สมชาย ใจดี',
    participants: 8,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/123456789',
    color: '#3B82F6'
  },
  {
    id: '2',
    title: 'อบรมออนไลน์',
    accountName: 'Zoom Education Account',
    accountId: 'zoom-edu-001',
    startTime: new Date(2025, 5, 30, 14, 0), // 30 มิถุนายน 2025, 14:00
    endTime: new Date(2025, 5, 30, 16, 0),
    description: 'อบรม Next.js สำหรับผู้เริ่มต้น',
    organizer: 'อาจารย์สมหญิง',
    participants: 25,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/987654321',
    color: '#10B981'
  },
  {
    id: '3',
    title: 'ประชุมลูกค้า',
    accountName: 'Zoom Business Account',
    accountId: 'zoom-biz-001',
    startTime: new Date(2025, 6, 1, 10, 0), // 1 กรกฎาคม 2025, 10:00
    endTime: new Date(2025, 6, 1, 11, 30),
    description: 'นำเสนอโครงการใหม่ให้ลูกค้า',
    organizer: 'นางสาวพิมพ์',
    participants: 5,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/456789123',
    color: '#8B5CF6'
  },
  {
    id: '4',
    title: 'วิดีโอคอล HR',
    accountName: 'Zoom Basic Account',
    accountId: 'zoom-basic-001',
    startTime: new Date(2025, 6, 2, 15, 30), // 2 กรกฎาคม 2025, 15:30
    endTime: new Date(2025, 6, 2, 16, 30),
    description: 'สัมภาษณ์งานตำแหน่งนักพัฒนา',
    organizer: 'คุณวิทย์',
    participants: 3,
    status: 'pending',
    meetingUrl: 'https://zoom.us/j/789123456',
    color: '#F59E0B'
  },
  {
    id: '5',
    title: 'ประชุมคณะกรรมการ',
    accountName: 'Zoom Enterprise Account',
    accountId: 'zoom-ent-001',
    startTime: new Date(2025, 6, 3, 13, 0), // 3 กรกฎาคม 2025, 13:00
    endTime: new Date(2025, 6, 3, 15, 0),
    description: 'ประชุมคณะกรรมการประจำเดือน',
    organizer: 'ประธานบอร์ด',
    participants: 12,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/321654987',
    color: '#EF4444'
  },
  {
    id: '6',
    title: 'Workshop Design',
    accountName: 'Zoom Pro Account #2',
    accountId: 'zoom-pro-002',
    startTime: new Date(2025, 6, 4, 9, 30), // 4 กรกฎาคม 2025, 9:30
    endTime: new Date(2025, 6, 4, 12, 0),
    description: 'Workshop การออกแบบ UI/UX',
    organizer: 'ครูดีไซน์',
    participants: 15,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/654987321',
    color: '#06B6D4'
  },
  {
    id: '7',
    title: 'Stand-up Meeting',
    accountName: 'Zoom Basic Account',
    accountId: 'zoom-basic-001',
    startTime: new Date(2025, 6, 5, 8, 30), // 5 กรกฎาคม 2025, 8:30
    endTime: new Date(2025, 6, 5, 9, 0),
    description: 'Daily stand-up ทีมพัฒนา',
    organizer: 'Scrum Master',
    participants: 6,
    status: 'confirmed',
    meetingUrl: 'https://zoom.us/j/147258369',
    color: '#84CC16'
  },
  {
    id: '8',
    title: 'การประชุมยกเลิก',
    accountName: 'Zoom Pro Account #1',
    accountId: 'zoom-pro-001',
    startTime: new Date(2025, 6, 6, 16, 0), // 6 กรกฎาคม 2025, 16:00
    endTime: new Date(2025, 6, 6, 17, 0),
    description: 'ประชุมที่ถูกยกเลิก',
    organizer: 'ผู้จัดการ',
    participants: 4,
    status: 'cancelled',
    color: '#6B7280'
  }
];

// ฟังก์ชันสำหรับสร้างข้อมูลการจองแบบสุ่ม
export const generateRandomBookings = (count: number = 20): ZoomBooking[] => {
  const titles = [
    'ประชุมทีมงาน',
    'อบรมออนไลน์',
    'นำเสนอโครงการ',
    'สัมภาษณ์งาน',
    'ประชุมลูกค้า',
    'Workshop',
    'Stand-up Meeting',
    'การประชุมคณะกรรมการ',
    'วิดีโอคอล',
    'การประชุมรายเดือน'
  ];

  const accounts = [
    'Zoom Pro Account #1',
    'Zoom Business Account',
    'Zoom Education Account',
    'Zoom Enterprise Account',
    'Zoom Basic Account'
  ];

  const organizers = [
    'สมชาย ใจดี',
    'นางสาวพิมพ์',
    'อาจารย์สมหญิง',
    'คุณวิทย์',
    'ประธานบอร์ด',
    'ครูดีไซน์'
  ];

  const statuses: ('confirmed' | 'pending' | 'cancelled')[] = ['confirmed', 'pending', 'cancelled'];
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16'];

  const bookings: ZoomBooking[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = Math.floor(Math.random() * 10) + 8; // 8-17 โมง
    const startMinute = Math.random() > 0.5 ? 0 : 30;
    const duration = Math.floor(Math.random() * 3) + 1; // 1-3 ชั่วโมง
    
    const startDate = new Date(2025, 6, Math.floor(Math.random() * 30) + 1, startHour, startMinute);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

    bookings.push({
      id: `random-${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      accountName: accounts[Math.floor(Math.random() * accounts.length)],
      accountId: `account-${i}`,
      startTime: startDate,
      endTime: endDate,
      description: `รายละเอียดการประชุม ${i + 1}`,
      organizer: organizers[Math.floor(Math.random() * organizers.length)],
      participants: Math.floor(Math.random() * 20) + 2,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      meetingUrl: `https://zoom.us/j/${Math.floor(Math.random() * 900000000) + 100000000}`,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  return bookings;
};
