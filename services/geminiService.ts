import { GoogleGenAI, Type } from "@google/genai";
import type { StoryFormData, ComicScript, ArtStyle } from '../types';
import { ART_STYLE_PROMPTS } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getPanelCount = (layout: string): number => {
    switch (layout) {
        case "2-panel strip": return 2;
        case "4-panel grid": return 4;
        case "6-panel page": return 6;
        case "Full splash page": return 1;
        default: return 4;
    }
}

export const generateComicScript = async (formData: StoryFormData): Promise<ComicScript> => {
    const panelCount = getPanelCount(formData.panelLayout);

    const prompt = `
    You are a master comic book writer. Your task is to create a compelling comic book script based on the user's request.
    The story should follow a clear 3-act structure: setup, conflict, and resolution, appropriately paced for the requested number of panels.
    Generate character-driven dialogue, scene-by-scene panel descriptions, narrative captions, and sound effects.
    It is crucial to maintain visual consistency for characters across panels. Refer to the character descriptions provided by the user.

    For each panel, create a detailed, specific "imagePrompt" that will be used by an AI image generator. This prompt should be purely visual and descriptive, mentioning camera angles (e.g., "close-up", "wide shot", "bird's eye view"), character actions, expressions, and background details. Do NOT include text elements like dialogue in the imagePrompt.

    USER'S REQUEST:
    - Story Idea: ${formData.storyPrompt}
    - Genre: ${formData.genre}
    - Art Style: ${formData.artStyle}
    - Number of Panels: ${panelCount}
    - Protagonist: ${formData.protagonist}
    - Antagonist: ${formData.antagonist}
    - Supporting Characters: ${formData.supportingChars}
    - Setting: ${formData.setting}

    Please generate a complete comic script in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    panels: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                panel: { type: Type.INTEGER },
                                description: { type: Type.STRING, description: "Narrative description of the action and scene in the panel." },
                                imagePrompt: { type: Type.STRING, description: "A highly detailed visual prompt for an AI image generator. Describe characters, action, setting, and camera angle. No text elements." },
                                dialogue: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            character: { type: Type.STRING },
                                            speech: { type: Type.STRING }
                                        },
                                        required: ["character", "speech"]
                                    },
                                    nullable: true,
                                },
                                caption: { type: Type.STRING, description: "Narrator's voice-over text.", nullable: true },
                                soundEffect: { type: Type.STRING, description: "Onomatopoeia like 'BOOM!', 'POW!'.", nullable: true }
                            },
                            required: ["panel", "description", "imagePrompt"]
                        }
                    }
                },
                required: ["title", "panels"]
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as ComicScript;
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonText);
        throw new Error("Received invalid JSON from the story generation API.");
    }
};


export const generatePanelImage = async (sceneDescription: string, artStyle: ArtStyle): Promise<string> => {
    const basePrompt = ART_STYLE_PROMPTS[artStyle] || ART_STYLE_PROMPTS["Classic American Comics"];
    // The sceneDescription now contains character info, so we just replace the scene part.
    const finalPrompt = basePrompt.replace(/\[SCENE_DESCRIPTION\]/g, sceneDescription);
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("Image generation failed, no images returned.");
    }
};