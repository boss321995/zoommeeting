import { NextResponse } from 'next/server';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// GET: ดึงรายการ booking ทั้งหมด (พร้อมข้อมูล account)
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'totacademy',
      password: process.env.DB_PASSWORD || 'bC^20z8q',
      database: process.env.DB_NAME || 'meeting',
    });
    const [rows]: [RowDataPacket[], unknown] = await connection.execute(`
      SELECT e.*, a.a_name, a.a_colorCode, a.a_participant
      FROM events e
      LEFT JOIN account a ON e.a_id = a.a_id
      WHERE e.e_startDate IS NOT NULL AND e.e_startDate != ''
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API /api/events GET error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

// POST: เพิ่ม booking ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { a_id, e_title, e_startDate, e_endDate, memo, isRecord = 0, isStudio = 0 } = body; // เพิ่ม isRecord, isStudio
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'totacademy',
      password: process.env.DB_PASSWORD || 'bC^20z8q',
      database: process.env.DB_NAME || 'meeting',
    });
    const [result]: [ResultSetHeader, unknown] = await connection.execute(
      'INSERT INTO events (a_id, e_title, e_startDate, e_endDate, memo, isRecord, isStudio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [a_id, e_title, e_startDate, e_endDate, memo, isRecord ? 1 : 0, isStudio ? 1 : 0]
    );
    await connection.end();
    return NextResponse.json({ success: true, insertId: result.insertId });
  } catch (error) {
    console.error('API /api/events POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: แก้ไข booking
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { e_id, a_id, e_title, e_startDate, e_endDate, memo, isRecord = 0, isStudio = 0 } = body; // เพิ่ม isRecord, isStudio
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'totacademy',
      password: process.env.DB_PASSWORD || 'bC^20z8q',
      database: process.env.DB_NAME || 'meeting',
    });
    const [result]: [ResultSetHeader, unknown] = await connection.execute(
      'UPDATE events SET a_id=?, e_title=?, e_startDate=?, e_endDate=?, memo=?, isRecord=?, isStudio=? WHERE e_id=?',
      [a_id, e_title, e_startDate, e_endDate, memo, isRecord ? 1 : 0, isStudio ? 1 : 0, e_id]
    );
    await connection.end();
    return NextResponse.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error('API /api/events PUT error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: ลบ booking
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { e_id } = body;
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'totacademy',
      password: process.env.DB_PASSWORD || 'bC^20z8q',
      database: process.env.DB_NAME || 'meeting',
    });
    const [result]: [ResultSetHeader, unknown] = await connection.execute(
      'DELETE FROM events WHERE e_id=?',
      [e_id]
    );
    await connection.end();
    return NextResponse.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error('API /api/events DELETE error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
