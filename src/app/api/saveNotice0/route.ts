import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST: Create a new notice
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.description || !data.category || !data.time) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const newNotice = await prisma.allNotice.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        time: new Date(data.time),
      },
    });

    return NextResponse.json({ message: "Notice saved successfully!", notice: newNotice }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Failed to save notice." }, { status: 500 });
  }
}

// ✅ GET: Fetch all notices
export async function GET() {
  try {
    const notices = await prisma.allNotice.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(notices, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Failed to fetch notices." }, { status: 500 });
  }
}

// ✅ PUT: Update a notice
export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id || !data.title || !data.description || !data.category || !data.time) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const updatedNotice = await prisma.allNotice.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        time: new Date(data.time),
      },
    });

    return NextResponse.json({ message: "Notice updated successfully!", notice: updatedNotice }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Failed to update notice." }, { status: 500 });
  }
}

// ✅ DELETE: Delete a notice
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Notice ID is required." }, { status: 400 });
    }

    await prisma.allNotice.delete({ where: { id } });

    return NextResponse.json({ message: "Notice deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Failed to delete notice." }, { status: 500 });
  }
}
