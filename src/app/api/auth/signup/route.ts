import { NextResponse } from "next/server"
// import prisma from "@/lib/prisma"
import { hash } from "bcrypt"
import { prisma } from "@/db/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const hashed_password = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
      },
    })
    console.log("user    ", user);

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    )
  }
}

