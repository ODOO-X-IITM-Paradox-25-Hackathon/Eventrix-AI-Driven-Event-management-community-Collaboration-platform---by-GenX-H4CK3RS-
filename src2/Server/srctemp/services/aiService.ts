
const GOOGLE_AI_API_KEY = "AIzaSyA7fQKCBtHPQUHGX1nZXDOWiJMlO31-uk8";

export interface AIImageGenerationParams {
  prompt: string;
  category: string;
}

export interface AIDescriptionParams {
  eventName: string;
  category: string;
  location: string;
}

export const generateEventImage = async (params: AIImageGenerationParams): Promise<string> => {
  try {
    // Simulate AI image generation - in real implementation, you'd use an actual AI service
    const imagePrompts = {
      music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      technology: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      cultural: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      education: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      business: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    };
    
    return imagePrompts[params.category as keyof typeof imagePrompts] || imagePrompts.technology;
  } catch (error) {
    console.error('Error generating image:', error);
    return "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  }
};

export const generateEventDescription = async (params: AIDescriptionParams): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate an engaging event description for "${params.eventName}" which is a ${params.category} event located at ${params.location}. The description should be 2-3 paragraphs, highlighting key features, benefits, and what attendees can expect. Make it exciting and informative.`
          }]
        }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || `Join us for ${params.eventName}, an exciting ${params.category} event at ${params.location}. This event promises to be an enriching experience for all attendees.`;
  } catch (error) {
    console.error('Error generating description:', error);
    return `Join us for ${params.eventName}, an exciting ${params.category} event at ${params.location}. This event promises to be an enriching experience for all attendees.`;
  }
};
