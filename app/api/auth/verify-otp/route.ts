import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()
    await connectDB()

    const user = await User.findOne({ email })
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })
    if (user.otp !== otp) return Response.json({ error: "Invalid OTP" }, { status: 400 })
    if (new Date() > user.otpExpiry) return Response.json({ error: "OTP expired" }, { status: 400 })

    await User.findOneAndUpdate({ email }, { otp: null, otpExpiry: null })

    const token = sign({ email }, process.env.NEXTAUTH_SECRET!, { expiresIn: "7d" })
    return Response.json({ message: "Login successful", token })

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
