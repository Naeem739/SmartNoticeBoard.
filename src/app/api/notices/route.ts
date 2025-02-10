import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Using a single URL
});

// Handle GET request - Fetch all notices
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM notices");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Handle POST request - Save or update a notice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, notice_id, width, height, left, top, color } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

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

// Handle DELETE request - Delete a notice
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await pool.query("DELETE FROM notices WHERE id = $1", [id]);

    return NextResponse.json({ message: "Notice deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
