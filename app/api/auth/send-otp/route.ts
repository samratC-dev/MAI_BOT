import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return Response.json({ error: "Email required" }, { status: 400 })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await connectDB()
    await User.findOneAndUpdate(
      { email },
      { email, otp, otpExpiry },
      { upsert: true }
    )

    await transporter.sendMail({
      from: `"MAI-BOT" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your MAI-BOT OTP Code",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MAI-BOT</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 8px; color: #1e293b;">${otp}</h1>
          <p style="color: #64748b;">Expires in 10 minutes. Do not share this code.</p>
        </div>
      `
    })

    return Response.json({ message: "OTP sent" })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}