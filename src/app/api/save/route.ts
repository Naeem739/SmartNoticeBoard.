import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Using a single URL
});

export async function POST(req: NextRequest) {
  try {
    const { id, notice_id, width, height, left, top, color } = await req.json();

    await pool.query(
      `INSERT INTO notices (id, notice_id, width, height, "left", "top", color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id)
       DO UPDATE SET notice_id = $2, width = $3, height = $4, "left" = $5, "top" = $6, color = $7`,
      [id, notice_id, width, height, left, top, color]
    );

    return NextResponse.json({ message: "Notice saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving notice:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
