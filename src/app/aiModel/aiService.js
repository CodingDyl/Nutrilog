export async function analyzeImage(imageData) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze image');
    }

    return data;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze image: ' + error.message);
  }
}
