import { GoogleGenAI } from "@google/genai";

export const summarizeVideo = async (channelName: string, videoUrl: string, videoTitle?: string) => {
  if (!videoUrl) {
    return { text: "請提供影片連結。", sources: [] };
  }

  try {
    // 1. Try to fetch transcript from backend
    let fullText = "";
    try {
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      });
      if (transcriptRes.ok) {
        const data = await transcriptRes.json();
        fullText = data.text;
      }
    } catch (e) {
      console.warn("Failed to fetch transcript, will fallback to Google Search", e);
    }

    // 2. Initialize Gemini AI
    let apiKey = process.env.GEMINI_API_KEY;
    
    // If running in Docker/K8s, the build-time env might be undefined, so we fetch it from the backend at runtime
    if (!apiKey || apiKey === "undefined") {
      try {
        const configRes = await fetch('/api/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          apiKey = configData.geminiApiKey;
        }
      } catch (e) {
        console.warn("Failed to fetch runtime config", e);
      }
    }

    if (!apiKey || apiKey === "undefined") {
      throw new Error("Gemini API Key is missing. Please check your environment variables or Kubernetes Secret.");
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = "";
    let config: any = {};

    if (fullText) {
      prompt = `你是一個專業的財經分析師。請幫我總結以下 ${channelName || '財經'} 的 YouTube 影片逐字稿。
請用繁體中文，詳細整理出以下重點：
1. 本集核心主題
2. 市場趨勢與總經分析
3. 提到的個股或產業重點
4. 講者的個人觀點與結論

逐字稿內容：
${fullText.substring(0, 30000)}`;
    } else {
      const searchTarget = videoTitle ? `${channelName} ${videoTitle}` : `${channelName} ${videoUrl}`;
      prompt = `你是一個專業的財經分析師。請幫我搜尋並總結以下 ${channelName || '財經'} 的 YouTube 影片內容：
影片標題/連結：${searchTarget}

請用繁體中文，詳細整理出以下重點：
1. 本集核心主題
2. 市場趨勢與總經分析
3. 提到的個股或產業重點
4. 講者的個人觀點與結論`;
      
      config = {
        tools: [{ googleSearch: {} }]
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      ...(Object.keys(config).length > 0 && { config })
    });

    return {
      text: response.text || "無法生成摘要",
      sources: []
    };
  } catch (error: any) {
    console.error("Error calling summarize API:", error);
    throw error;
  }
};
