// Simple API route for admin users (mock, replace with DB query as needed)
import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET() {
  // เชื่อมต่อฐานข้อมูล MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'totacademy',
    password: process.env.DB_PASSWORD || 'bC^20z8q',
    database: process.env.DB_NAME || 'meeting',
  });

  // ดึงรายชื่อ userid ทั้งหมดจากตาราง user
  const [rows]: [RowDataPacket[], unknown] = await connection.execute('SELECT userid FROM user');
  const users = Array.isArray(rows) ? rows.map((row) => (row as { userid: string }).userid) : [];
  await connection.end();

  return NextResponse.json({ users });
}
