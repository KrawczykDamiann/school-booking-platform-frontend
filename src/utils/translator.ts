// src/utils/translator.ts

export const translateSubject = async (text: string, targetLang: 'en' | 'uk') => {
  try {
    // Korzystamy z darmowego i szybkiego API MyMemory
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pl|${targetLang}`
    );
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text; // Fallback: jeśli API zawiedzie, zwraca oryginalny tekst
  } catch (error) {
    console.error("Błąd tłumaczenia:", error);
    return text;
  }
};