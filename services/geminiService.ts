import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
당신은 '아이케어 프로'라는 안과 앱의 전문 AI 상담사입니다.
사용자의 눈 건강, 시력 보호, 안구 건조증, 눈의 피로에 관한 질문에 대해 의학적으로 신뢰할 수 있는 정보를 바탕으로 친절하게 답변해 주세요.
하지만 당신은 의사를 완전히 대체할 수 없으므로, 심각한 증상의 경우 반드시 병원 방문을 권유해야 합니다.
답변은 한국어로 작성하며, 간결하고 이해하기 쉽게 설명하세요.
`;

export const getEyeHealthAdvice = async (userQuery: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "죄송합니다. 현재 답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};