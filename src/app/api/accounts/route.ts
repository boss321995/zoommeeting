import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'totacademy',
      password: process.env.DB_PASSWORD || 'bC^20z8q',
      database: process.env.DB_NAME || 'meeting',
    });
    const [rows]: [RowDataPacket[], unknown] = await connection.execute('SELECT a_id, a_name, a_colorCode, a_participant FROM account');
    await connection.end();
    return NextResponse.json({ accounts: rows });
  } catch (error) {
    console.error('API /api/accounts error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
