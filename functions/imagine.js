export async function onRequestPost(context) {
  const GEMINI_IMAGE_KEY = context.env.GEMINI_IMAGE_KEY || context.env.GEMINI_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const { prompt } = await context.request.json();
    if (!prompt) return new Response(JSON.stringify({ error: "No prompt" }), { status: 400, headers });

    // Use Gemini 2.0 Flash with image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_IMAGE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Create a beautiful, professional motivational poster image: ${prompt}. High quality, vibrant colors, suitable for social media sharing.` }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
            temperature: 1,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini image error:", JSON.stringify(data));
      throw new Error(data.error?.message || "Image generation failed");
    }

    // Find image part in response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error("No image in response:", JSON.stringify(data).slice(0,500));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({
      image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      model: "gemini-2.0-flash"
    }), { headers });

  } catch (err) {
    console.error("imagine.js error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
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
