"use client"

import { useRouter } from "next/navigation"
import Hero from "@/components/ui/animated-shader-hero"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="bg-black">
      <Hero
        trustBadge={{
          text: "AI-powered assistant for everyone.",
          icons: ["✨"]
        }}
        headline={{
          line1: "Meet MAI-BOT",
          line2: "Your AI Assistant"
        }}
        subtitle="A smart, fast AI chatbot you can embed on any website. Login with your email and start chatting in seconds."
        buttons={{
          primary: {
            text: "Get Started Free",
            onClick: () => router.push("/login")
          },
          secondary: {
            text: "See How It Works",
            onClick: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
          }
        }}
      />

      {/* Features Section */}
      <div id="features" className="bg-slate-900 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Why MAI-BOT?
          </h2>
          <p className="text-slate-400 text-center mb-16 text-lg">
            Everything you need in an AI assistant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Powered by Groq's Llama 3 — responses in milliseconds, not seconds."
              },
              {
                icon: "🔒",
                title: "Secure Login",
                desc: "OTP-based email authentication. No passwords, no hassle."
              },
              {
                icon: "🌐",
                title: "Embed Anywhere",
                desc: "One script tag and your chatbot lives on any website instantly."
              },
              {
                icon: "💬",
                title: "Streaming Replies",
                desc: "Text appears word by word — just like ChatGPT."
              },
              {
                icon: "🧠",
                title: "Context Aware",
                desc: "Remembers the full conversation so replies are always relevant."
              },
              {
                icon: "🆓",
                title: "Free to Use",
                desc: "Built on free APIs — no credit card, no hidden costs."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-950 py-24 px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Login with your email and start chatting in seconds.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all hover:scale-105"
        >
          Start for Free →
        </button>
      </div>

      {/* Footer */}
      <div className="bg-black py-8 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm">
          © 2026 MAI-BOT · Built with Next.js & Groq
        </p>
      </div>
    </div>
  )
}