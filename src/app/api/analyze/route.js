import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    // Clean up base64 string if it includes data URL prefix
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide nutritional information. Format your response strictly as a JSON object with the following structure: {\"name\": string, \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number}. Only respond with the JSON object, no other text."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.5
    });

    // Add error handling for JSON parsing
    try {
      const content = response.choices[0].message.content.trim();
      // Sometimes GPT might include markdown code blocks, so let's clean those
      const cleanJson = content.replace(/```json\n?|\n?```/g, '');
      const result = JSON.parse(cleanJson);
      return Response.json(result);
    } catch (jsonError) {
      console.error('JSON parsing error:', response.choices[0].message.content);
      return Response.json({ error: 'Invalid response format from AI' }, { status: 500 });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 