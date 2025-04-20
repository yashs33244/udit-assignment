import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  try {
    const { id, username, email } = await request.json()

    // Get current user
    const user = await prisma.nosqlUser.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create update token
    const updateToken = crypto.randomUUID()

    // Store update request
    await prisma.nosqlUpdateRequest.create({
      data: {
        userId: id,
        newUsername: username,
        newEmail: email,
        token: updateToken,
      },
    })

    // Send verification email
    await sendVerificationEmail({
      email: user.email,
      token: updateToken,
      type: "update",
      database: "nosql",
    })

    return NextResponse.json({ message: "Verification email sent" }, { status: 200 })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
