export async function onRequestPost(context) {
  const GEMINI_IMAGE_KEY = context.env.GEMINI_IMAGE_KEY || context.env.GEMINI_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const { prompt } = await context.request.json();
    if (!prompt) return new Response(JSON.stringify({ error: "No prompt" }), { status: 400, headers });

    // Try Imagen 3
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_IMAGE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetySetting: "block_only_high",
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Try Gemini 2.0 Flash image generation as fallback
      const r2 = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_IMAGE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
          })
        }
      );
      const d2 = await r2.json();
      const part = d2.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        return new Response(JSON.stringify({
          image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          model: "gemini-2.0-flash"
        }), { headers });
      }
      throw new Error(data.error?.message || "Image generation failed");
    }

    const imageData = data.predictions?.[0]?.bytesBase64Encoded;
    if (!imageData) throw new Error("No image returned");

    return new Response(JSON.stringify({
      image: `data:image/png;base64,${imageData}`,
      model: "imagen-3"
    }), { headers });

  } catch (err) {
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
