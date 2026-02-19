
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedOutput, ProjectFile, SiteConfig } from "../types";

export const generateWebsite = async (
  prompt: string, 
  apiKey: string, 
  previousOutput?: GeneratedOutput,
  config?: SiteConfig
): Promise<GeneratedOutput> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const configContext = config ? `
    PROJECT CONFIGURATION (Strictly follow these section parameters):
    ${JSON.stringify(config, null, 2)}
  ` : '';

  const historyContext = previousOutput 
    ? `The user is refining an existing multi-page project.
       CURRENT PROJECT FILES:
       ${previousOutput.files.map(f => `--- ${f.path} ---\n${f.content}`).join('\n\n')}
       
       Apply the user's requested changes while maintaining the overall design system and GSAP integration.`
    : "This is a brand new project request.";

  const systemInstruction = `
    You are a world-class Senior Creative Developer and Architect specializing in high-end Next.js and GSAP experiences.
    
    CRITICAL OBJECTIVES:
    1. BUILD A FULL, PROFESSIONAL, MULTI-PAGE WEBSITE: No placeholders. No truncation.
    2. MODULAR COMPONENT ARCHITECTURE: Create reusable React components in 'src/components/ui/' (e.g., FeatureCard, HeroBanner, SectionHeader, ParallaxWrapper). The main pages must import and use these.
    3. STRICT CONFIG ADHERENCE: If a 'config' is provided, you MUST use the specified sections, titles, animationStyles, 'scrub' values, and 'pin' settings in your GSAP implementation.
    4. REFINED GSAP & PARALLAX:
       - HERO PARALLAX: Implement smooth background parallax in the Hero section using 'gsap' and 'ScrollTrigger'.
       - SCRUBBING: Use the provided 'scrub' value (0 to 3) in ScrollTrigger for buttery smooth, scroll-linked animations.
       - PINNING: Use 'pin: true' in ScrollTrigger for sections where it is requested to keep them in view during animation.
       - ENTRY ANIMATIONS: For the Hero section, use the 'entryAnimation' (fade-in, slide-down, scale-up) for the initial load sequence.
    5. MULTI-PAGE STRUCTURE: At least 5 pages (Home, Collections, About, Contact, globals.css).
    6. FULL MANIFEST: Include package.json, tailwind.config.ts, tsconfig.json, next.config.mjs.

    ${configContext}

    OUTPUT FORMAT:
    Return a JSON object:
    {
      "files": [{ "path": string, "content": string, "language": "typescript" | "json" | "css" }],
      "previewHtml": "A single standalone HTML file (using Tailwind & GSAP CDNs) representing the Home Page with ALL specified sections, granular GSAP (scrub/pin), and Hero parallax fully functional.",
      "explanation": "Summary of the architecture, component reusability, and GSAP implementation."
    }

    ${historyContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING },
                  content: { type: Type.STRING },
                  language: { type: Type.STRING }
                },
                required: ["path", "content", "language"]
              }
            },
            previewHtml: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["files", "previewHtml", "explanation"]
        },
        thinkingConfig: { thinkingBudget: 24576 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response.");
    
    return JSON.parse(text) as GeneratedOutput;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Failed to generate project. Try refining your prompt.");
  }
};
