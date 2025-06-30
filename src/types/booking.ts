export interface ZoomBooking {
  id: string;
  title: string;
  accountName: string;
  accountId: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  organizer: string;
  participants: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  meetingUrl?: string;
  color?: string;
  isRecord?: boolean;
  isStudio?: boolean;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: ZoomBooking[];
}
