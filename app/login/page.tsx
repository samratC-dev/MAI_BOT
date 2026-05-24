"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSendOtp() {
    if (!email.trim()) return
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else setStep("otp")
    setLoading(false)
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) return
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    })
    const data = await res.json()
    if (!res.ok) setError(data.error)
    else {
      localStorage.setItem("token", data.token)
      router.push("/chat")
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-sm border border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold mb-4">
          AI
        </div>
        <h1 className="text-xl font-semibold text-white mb-1">Welcome to MAI-BOT</h1>
        <p className="text-sm text-slate-400 mb-6">
          {step === "email" ? "Enter your email to continue" : `OTP sent to ${email}`}
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {step === "email" ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              placeholder="you@example.com"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-blue-500 mb-3"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-blue-500 mb-3"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-slate-400 text-sm mt-2 hover:text-white transition-colors"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}