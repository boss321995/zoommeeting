import { NextResponse } from "next/server";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "totacademy",
    password: process.env.DB_PASSWORD || "bC^20z8q",
    database: process.env.DB_NAME || "meeting",
  });

  // ดึง account
  const [accounts]: [RowDataPacket[], unknown] = await connection.execute("SELECT * FROM account");
  // ดึง events
  const [events]: [RowDataPacket[], unknown] = await connection.execute("SELECT * FROM events");
  await connection.end();

  // สรุปจำนวนนงานทั้งหมดประจำปีนี้
  const year = new Date().getFullYear();
  const eventsThisYear = (events as { e_startDate: string; e_endDate: string; a_id: string }[]).filter((e) => {
    const start = new Date(e.e_startDate);
    return start.getFullYear() === year;
  });
  const totalEventsThisYear = eventsThisYear.length;

  // รวมจำนวนนชั่วโมงที่ใช้ในการประชุมในปีนี้
  let totalHours = 0;
  eventsThisYear.forEach((e) => {
    const start = new Date(e.e_startDate);
    const end = new Date(e.e_endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // ชั่วโมง
    if (!isNaN(diff) && diff > 0) totalHours += diff;
  });

  // ข้อมูลการใช้งานแยกตาม account
  const usageByAccount: Record<string, { a_name: string; count: number; hours: number }> = {};
  (accounts as { a_id: string; a_name: string }[]).forEach((acc) => {
    const accEvents = eventsThisYear.filter((e) => e.a_id === acc.a_id);
    let accHours = 0;
    accEvents.forEach((e) => {
      const start = new Date(e.e_startDate);
      const end = new Date(e.e_endDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (!isNaN(diff) && diff > 0) accHours += diff;
    });
    usageByAccount[acc.a_id] = {
      a_name: acc.a_name,
      count: accEvents.length,
      hours: accHours,
    };
  });

  return NextResponse.json({
    accounts,
    events,
    summary: {
      totalEventsThisYear,
      totalHours,
      usageByAccount,
    },
  });
}
