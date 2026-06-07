export async function onRequestPost(context) {
  const GROQ_API_KEY = context.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

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
      if (response.status === 429 || response.status === 503 || errMsg.includes("rate") || errMsg.includes("capacity")) {
        throw new Error(`rate_limit: ${errMsg}`);
      }
      throw new Error(errMsg || "Groq error");
    }

    return data.choices?.[0]?.message?.content || "";
  };

  try {
    const body = await context.request.json();
    const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"];
    let text = "";

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

    if (!text) {
      text = "I'm a little overwhelmed right now. Give me a moment and try again.";
    }

    return new Response(
      JSON.stringify({ content: [{ type: "text", text }] }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );

  } catch (err) {
    const isRateLimit = err.message?.includes("rate") || err.message?.includes("429");
    const text = isRateLimit
      ? "I'm getting a lot of requests right now. Wait a few seconds and try again."
      : "I had a momentary issue. Please try again.";

    return new Response(
      JSON.stringify({ content: [{ type: "text", text }] }),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
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
