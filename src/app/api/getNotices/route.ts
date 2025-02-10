import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Fetch Notices (GET)
export async function GET() {
  try {
    const res = await pool.query(`SELECT * FROM public."AllNotice" ORDER BY "time" DESC`);
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// Add Notice (POST) - New route for adding notices
export async function POST(req: Request) {
  try {
    const { title, description, category } = await req.json();
    const time = new Date().toISOString(); // Current timestamp for the notice
    const res = await pool.query(
      `INSERT INTO public."AllNotice" (title, description, category, time) VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, description, category, time]
    );
    
    return NextResponse.json({ message: "Notice added successfully", id: res.rows[0].id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add notice" }, { status: 500 });
  }
}

// Update Notice (PUT)
export async function PUT(req: Request) {
  try {
    const { id, title, description } = await req.json();
    await pool.query(`UPDATE public."AllNotice" SET title = $1, description = $2 WHERE id = $3`, [
      title,
      description,
      id,
    ]);
    return NextResponse.json({ message: "Notice updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
  }
}

// Delete Notice (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query(`DELETE FROM public."AllNotice" WHERE id = $1`, [id]);
    return NextResponse.json({ message: "Notice deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
