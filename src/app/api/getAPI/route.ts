import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query("SELECT id, title FROM AllNotice");

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
