import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep replies short and clear." },
        ...messages
      ],
      stream: true
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      }
    })

    return new Response(readable, { headers: { "Content-Type": "text/plain" } })

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}
