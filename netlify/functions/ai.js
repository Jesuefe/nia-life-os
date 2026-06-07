exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
  }

  const callGroq = async (model) => {
    const { system, messages, max_tokens } = JSON.parse(event.body);
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
      // Rate limit or overload — throw so we can retry with fallback model
      if (response.status === 429 || response.status === 503 || errMsg.includes("rate") || errMsg.includes("capacity")) {
        throw new Error(`rate_limit: ${errMsg}`);
      }
      throw new Error(errMsg || "Groq error");
    }

    return data.choices?.[0]?.message?.content || "";
  };

  try {
    let text = "";
    let lastError = "";

    // Try primary model first
    const models = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",       // faster fallback
      "gemma2-9b-it",               // second fallback
    ];

    for (const model of models) {
      try {
        text = await callGroq(model);
        break; // success — stop trying
      } catch (e) {
        lastError = e.message;
        // If rate limited, wait 1 second and try next model
        if (e.message.startsWith("rate_limit")) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        // Other errors — don't retry
        throw e;
      }
    }

    if (!text) {
      return {
        statusCode: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          content: [{
            type: "text",
            text: "I'm a little overwhelmed with requests right now. Give me a moment and try again — I'll be right back.",
          }],
          _rate_limited: true,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ content: [{ type: "text", text }] }),
    };

  } catch (err) {
    // Return a graceful message instead of a raw error
    const isRateLimit = err.message?.includes("rate") || err.message?.includes("429") || err.message?.includes("capacity");
    const userMessage = isRateLimit
      ? "I'm getting a lot of requests right now. Please wait a few seconds and try again."
      : "Something went wrong on my end. Please try sending your message again.";

    return {
      statusCode: 200, // Return 200 so the app shows the message gracefully
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ content: [{ type: "text", text: userMessage }] }),
    };
  }
};
