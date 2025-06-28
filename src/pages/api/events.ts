import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'meeting',
  });

  // Join events กับ account เพื่อดึงสีและชื่อ
  const [rows] = await connection.execute(`
    SELECT e.*, a.a_name, a.a_colorCode, a.a_participant
    FROM events e
    LEFT JOIN account a ON e.a_id = a.a_id
    WHERE e.e_startDate IS NOT NULL AND e.e_startDate != ''
  `);

  await connection.end();

  res.status(200).json(rows);
}