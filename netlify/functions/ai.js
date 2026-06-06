exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  try {
    const { model, max_tokens, system, messages } = JSON.parse(event.body);

    // Convert Anthropic format to Groq/OpenAI format
    const groqMessages = [];
    if (system) {
      groqMessages.push({ role: "system", content: system });
    }
    groqMessages.push(...messages);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        max_tokens: max_tokens || 1000,
        messages: groqMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Groq error" }),
      };
    }

    // Convert Groq response back to Anthropic format so the app doesn't need changes
    const converted = {
      content: [
        {
          type: "text",
          text: data.choices?.[0]?.message?.content || "",
        },
      ],
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(converted),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy error", detail: err.message }),
    };
  }
};
