import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // Load environment variables

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Using a single URL
});

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    await pool.query("DELETE FROM notices WHERE id = $1", [id]);

    return NextResponse.json({ message: "Notice deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
