import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Using a single URL
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM notices");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
