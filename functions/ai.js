export async function onRequestPost(context) {
  const GROQ_API_KEY = context.env.GROQ_API_KEY;
  const GEMINI_API_KEY = context.env.GEMINI_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  const callGemini = async (body) => {
    const { system, messages, max_tokens } = body;
    // Build Gemini conversation
    const geminiMessages = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: system ? { parts: [{ text: system }] } : undefined,
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: max_tokens || 1000,
            temperature: 0.8,
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini error");
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const callGroq = async (model, body) => {
    const { system, messages, max_tokens } = body;
    const groqMessages = [];
    if (system) groqMessages.push({ role: "system", content: system });
    groqMessages.push(...messages);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: max_tokens || 1000,
        messages: groqMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error?.message || "";
      if (response.status === 429 || errMsg.includes("rate") || errMsg.includes("capacity")) {
        throw new Error(`rate_limit: ${errMsg}`);
      }
      throw new Error(errMsg || "Groq error");
    }
    return data.choices?.[0]?.message?.content || "";
  };

  try {
    const body = await context.request.json();
    let text = "";

    // Try Gemini first (better instruction following)
    if (GEMINI_API_KEY) {
      try {
        text = await callGemini(body);
      } catch (e) {
        console.error("Gemini failed, falling back to Groq:", e.message);
      }
    }

    // Fall back to Groq models if Gemini fails
    if (!text && GROQ_API_KEY) {
      const models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma2-9b-it"
      ];
      for (const model of models) {
        try {
          text = await callGroq(model, body);
          break;
        } catch (e) {
          if (e.message.startsWith("rate_limit")) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw e;
        }
      }
    }

    if (!text) {
      text = "I'm a little overwhelmed right now. Give me a moment and try again.";
    }

    return new Response(
      JSON.stringify({ content: [{ type: "text", text }] }),
      { headers }
    );

  } catch (err) {
    const isRateLimit = err.message?.includes("rate") || err.message?.includes("429");
    const text = isRateLimit
      ? "I'm getting a lot of requests right now. Wait a few seconds and try again."
      : "I had a momentary issue. Please try again.";

    return new Response(
      JSON.stringify({ content: [{ type: "text", text }] }),
      { headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
