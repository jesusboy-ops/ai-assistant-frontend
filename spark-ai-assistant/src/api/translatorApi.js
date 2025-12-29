// Translator API - Frontend fallback when external APIs fail
import axios from 'axios';
import { aiApi } from './aiApi';

// Try multiple translation services
const TRANSLATION_SERVICES = [
  {
    name: 'LibreTranslate',
    baseUrl: 'https://libretranslate.de',
    languages: '/languages',
    translate: '/translate'
  },
  // Fallback to a simple service or local translations
];

// Fallback language list when API fails
const FALLBACK_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' }
];

// Simple translation fallbacks for common phrases and sentences
const SIMPLE_TRANSLATIONS = {
  // Basic greetings
  'hello': {
    'es': 'hola',
    'fr': 'bonjour', 
    'de': 'hallo',
    'it': 'ciao',
    'pt': 'olá',
    'ru': 'привет',
    'ja': 'こんにちは',
    'ko': '안녕하세요',
    'zh': '你好'
  },
  'goodbye': {
    'es': 'adiós',
    'fr': 'au revoir',
    'de': 'auf wiedersehen',
    'it': 'arrivederci',
    'pt': 'tchau',
    'ru': 'до свидания',
    'ja': 'さようなら',
    'ko': '안녕히 가세요',
    'zh': '再见'
  },
  'thank you': {
    'es': 'gracias',
    'fr': 'merci',
    'de': 'danke',
    'it': 'grazie',
    'pt': 'obrigado',
    'ru': 'спасибо',
    'ja': 'ありがとう',
    'ko': '감사합니다',
    'zh': '谢谢'
  },
  'please': {
    'es': 'por favor',
    'fr': 's\'il vous plaît',
    'de': 'bitte',
    'it': 'per favore',
    'pt': 'por favor',
    'ru': 'пожалуйста',
    'ja': 'お願いします',
    'ko': '제발',
    'zh': '请'
  },
  'yes': {
    'es': 'sí',
    'fr': 'oui',
    'de': 'ja',
    'it': 'sì',
    'pt': 'sim',
    'ru': 'да',
    'ja': 'はい',
    'ko': '네',
    'zh': '是'
  },
  'no': {
    'es': 'no',
    'fr': 'non',
    'de': 'nein',
    'it': 'no',
    'pt': 'não',
    'ru': 'нет',
    'ja': 'いいえ',
    'ko': '아니요',
    'zh': '不'
  },
  'excuse me': {
    'es': 'disculpe',
    'fr': 'excusez-moi',
    'de': 'entschuldigung',
    'it': 'scusi',
    'pt': 'com licença',
    'ru': 'извините',
    'ja': 'すみません',
    'ko': '실례합니다',
    'zh': '对不起'
  },
  
  // Full sentences - Questions
  'how are you': {
    'es': '¿cómo estás?',
    'fr': 'comment allez-vous?',
    'de': 'wie geht es dir?',
    'it': 'come stai?',
    'pt': 'como você está?',
    'ru': 'как дела?',
    'ja': '元気ですか?',
    'ko': '어떻게 지내세요?',
    'zh': '你好吗?'
  },
  'what is your name': {
    'es': '¿cómo te llamas?',
    'fr': 'comment vous appelez-vous?',
    'de': 'wie heißt du?',
    'it': 'come ti chiami?',
    'pt': 'qual é o seu nome?',
    'ru': 'как тебя зовут?',
    'ja': 'お名前は何ですか?',
    'ko': '이름이 뭐예요?',
    'zh': '你叫什么名字?'
  },
  'where are you from': {
    'es': '¿de dónde eres?',
    'fr': 'd\'où venez-vous?',
    'de': 'woher kommst du?',
    'it': 'di dove sei?',
    'pt': 'de onde você é?',
    'ru': 'откуда ты?',
    'ja': 'どちらから来ましたか?',
    'ko': '어디서 왔어요?',
    'zh': '你从哪里来?'
  },
  'do you speak english': {
    'es': '¿hablas inglés?',
    'fr': 'parlez-vous anglais?',
    'de': 'sprichst du englisch?',
    'it': 'parli inglese?',
    'pt': 'você fala inglês?',
    'ru': 'ты говоришь по-английски?',
    'ja': '英語を話しますか?',
    'ko': '영어 할 줄 아세요?',
    'zh': '你会说英语吗?'
  },
  'how much does it cost': {
    'es': '¿cuánto cuesta?',
    'fr': 'combien ça coûte?',
    'de': 'wie viel kostet es?',
    'it': 'quanto costa?',
    'pt': 'quanto custa?',
    'ru': 'сколько это стоит?',
    'ja': 'いくらですか?',
    'ko': '얼마예요?',
    'zh': '多少钱?'
  },
  'where is the bathroom': {
    'es': '¿dónde está el baño?',
    'fr': 'où sont les toilettes?',
    'de': 'wo ist die toilette?',
    'it': 'dov\'è il bagno?',
    'pt': 'onde fica o banheiro?',
    'ru': 'где туалет?',
    'ja': 'トイレはどこですか?',
    'ko': '화장실이 어디예요?',
    'zh': '厕所在哪里?'
  },
  
  // Full sentences - Statements
  'i am fine': {
    'es': 'estoy bien',
    'fr': 'je vais bien',
    'de': 'mir geht es gut',
    'it': 'sto bene',
    'pt': 'estou bem',
    'ru': 'у меня все хорошо',
    'ja': '元気です',
    'ko': '괜찮아요',
    'zh': '我很好'
  },
  'i love you': {
    'es': 'te amo',
    'fr': 'je t\'aime',
    'de': 'ich liebe dich',
    'it': 'ti amo',
    'pt': 'eu te amo',
    'ru': 'я тебя люблю',
    'ja': '愛しています',
    'ko': '사랑해요',
    'zh': '我爱你'
  },
  'i am sorry': {
    'es': 'lo siento',
    'fr': 'je suis désolé',
    'de': 'es tut mir leid',
    'it': 'mi dispiace',
    'pt': 'me desculpe',
    'ru': 'извини',
    'ja': 'ごめんなさい',
    'ko': '미안해요',
    'zh': '对不起'
  },
  'i don\'t understand': {
    'es': 'no entiendo',
    'fr': 'je ne comprends pas',
    'de': 'ich verstehe nicht',
    'it': 'non capisco',
    'pt': 'não entendo',
    'ru': 'я не понимаю',
    'ja': 'わかりません',
    'ko': '이해 못해요',
    'zh': '我不明白'
  },
  'i need help': {
    'es': 'necesito ayuda',
    'fr': 'j\'ai besoin d\'aide',
    'de': 'ich brauche hilfe',
    'it': 'ho bisogno di aiuto',
    'pt': 'preciso de ajuda',
    'ru': 'мне нужна помощь',
    'ja': '助けが必要です',
    'ko': '도움이 필요해요',
    'zh': '我需要帮助'
  },
  'nice to meet you': {
    'es': 'mucho gusto',
    'fr': 'enchanté de vous rencontrer',
    'de': 'freut mich, sie kennenzulernen',
    'it': 'piacere di conoscerti',
    'pt': 'prazer em conhecê-lo',
    'ru': 'приятно познакомиться',
    'ja': 'はじめまして',
    'ko': '만나서 반가워요',
    'zh': '很高兴见到你'
  },
  'have a good day': {
    'es': 'que tengas un buen día',
    'fr': 'passez une bonne journée',
    'de': 'haben sie einen schönen tag',
    'it': 'buona giornata',
    'pt': 'tenha um bom dia',
    'ru': 'хорошего дня',
    'ja': '良い一日を',
    'ko': '좋은 하루 되세요',
    'zh': '祝你有美好的一天'
  },
  
  // Travel and directions
  'where is the train station': {
    'es': '¿dónde está la estación de tren?',
    'fr': 'où est la gare?',
    'de': 'wo ist der bahnhof?',
    'it': 'dov\'è la stazione?',
    'pt': 'onde fica a estação de trem?',
    'ru': 'где вокзал?',
    'ja': '駅はどこですか?',
    'ko': '기차역이 어디예요?',
    'zh': '火车站在哪里?'
  },
  'i am lost': {
    'es': 'estoy perdido',
    'fr': 'je suis perdu',
    'de': 'ich habe mich verirrt',
    'it': 'mi sono perso',
    'pt': 'estou perdido',
    'ru': 'я заблудился',
    'ja': '道に迷いました',
    'ko': '길을 잃었어요',
    'zh': '我迷路了'
  },
  'can you help me': {
    'es': '¿puedes ayudarme?',
    'fr': 'pouvez-vous m\'aider?',
    'de': 'können sie mir helfen?',
    'it': 'puoi aiutarmi?',
    'pt': 'você pode me ajudar?',
    'ru': 'можете мне помочь?',
    'ja': '手伝ってもらえますか?',
    'ko': '도와주실 수 있나요?',
    'zh': '你能帮助我吗?'
  }
};

export const translatorApi = {
  // AI-powered translation (enhanced for long texts)
  translateWithAI: async (text, sourceLang, targetLang) => {
    try {
      console.log('🤖 Attempting AI-powered translation...');
      console.log(`📝 Text length: ${text.length} characters`);
      
      // Language name mapping for better AI understanding
      const languageNames = {
        'en': 'English',
        'es': 'Spanish', 
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'da': 'Danish'
      };

      const sourceLanguage = languageNames[sourceLang] || sourceLang;
      const targetLanguage = languageNames[targetLang] || targetLang;

      // Use the AI API directly for better translation
      const translation = await aiApi.translateText(text, sourceLanguage, targetLanguage);
      
      console.log('✅ AI translation successful:', translation);
      
      return {
        success: true,
        data: {
          translatedText: translation,
          sourceLang,
          targetLang,
          originalText: text,
          method: 'ai_powered'
        }
      };
    } catch (error) {
      console.warn('⚠️ AI translation failed:', error.message);
      return {
        success: false,
        error: `AI translation failed: ${error.message}`
      };
    }
  },
  // Get available languages
  getLanguages: async () => {
    try {
      console.log('🌐 Fetching languages from LibreTranslate...');
      // Try LibreTranslate first
      const response = await axios.get(`${TRANSLATION_SERVICES[0].baseUrl}${TRANSLATION_SERVICES[0].languages}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 8000, // Increased timeout
      });
      
      console.log('✅ Languages fetched successfully:', response.data?.length);
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.warn('⚠️ External translation service unavailable:', error.message);
      console.log('🔄 Using fallback languages');
      return {
        success: true,
        data: FALLBACK_LANGUAGES,
        fallback: true,
        error: `External service unavailable: ${error.message}`
      };
    }
  },

  // Translate text
  translateText: async (text, sourceLang, targetLang) => {
    console.log(`🔍 Translating: "${text}" (${sourceLang} → ${targetLang})`);
    
    // Try AI-powered translation first for all text (including long sentences)
    try {
      console.log('🤖 Attempting AI-powered translation...');
      const aiResult = await translatorApi.translateWithAI(text, sourceLang, targetLang);
      if (aiResult.success) {
        console.log('✅ AI translation successful');
        return aiResult;
      }
    } catch (error) {
      console.warn('⚠️ AI translation failed, trying fallback methods:', error.message);
    }
    
    // Enhanced matching for full sentences and phrases (fallback)
    const normalizedText = text.toLowerCase().trim()
      .replace(/[?!.,:;]/g, '') // Remove punctuation for matching
      .replace(/\s+/g, ' '); // Normalize spaces
    
    // Check for exact matches first (including full sentences)
    if (SIMPLE_TRANSLATIONS[normalizedText] && SIMPLE_TRANSLATIONS[normalizedText][targetLang]) {
      console.log('✅ Using exact sentence translation');
      return {
        success: true,
        data: {
          translatedText: SIMPLE_TRANSLATIONS[normalizedText][targetLang],
          sourceLang,
          targetLang,
          originalText: text,
          method: 'exact_match'
        }
      };
    }
    
    // Check for partial matches in longer sentences
    let bestMatch = null;
    let bestMatchLength = 0;
    
    for (const [phrase, translations] of Object.entries(SIMPLE_TRANSLATIONS)) {
      if (normalizedText.includes(phrase) && phrase.length > bestMatchLength && translations[targetLang]) {
        bestMatch = {
          phrase,
          translation: translations[targetLang],
          length: phrase.length
        };
        bestMatchLength = phrase.length;
      }
    }
    
    // If we found a good partial match (at least 4 characters), use it with context
    if (bestMatch && bestMatch.length >= 4) {
      console.log(`✅ Using partial match: "${bestMatch.phrase}" → "${bestMatch.translation}"`);
      
      // Try to construct a better translation by replacing the known phrase
      let constructedTranslation = text.toLowerCase().replace(bestMatch.phrase, bestMatch.translation);
      
      return {
        success: true,
        data: {
          translatedText: constructedTranslation,
          sourceLang,
          targetLang,
          originalText: text,
          method: 'partial_match',
          matchedPhrase: bestMatch.phrase
        }
      };
    }

    try {
      console.log('🌐 Attempting API translation via LibreTranslate...');
      // Try LibreTranslate API
      const response = await axios.post(`${TRANSLATION_SERVICES[0].baseUrl}${TRANSLATION_SERVICES[0].translate}`, {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000, // Increased timeout for translation
      });
      
      console.log('✅ API translation successful:', response.data);
      if (response.data && response.data.translatedText) {
        return {
          success: true,
          data: {
            translatedText: response.data.translatedText,
            sourceLang,
            targetLang,
            originalText: text,
            method: 'api'
          }
        };
      }
      throw new Error('Invalid API response format');
    } catch (error) {
      console.warn('⚠️ External translation service failed:', error.message);
      
      // Enhanced fallback for sentences - try word-by-word translation
      const words = text.toLowerCase().split(/\s+/);
      const translatedWords = [];
      let hasTranslations = false;
      
      for (const word of words) {
        const cleanWord = word.replace(/[?!.,:;]/g, '');
        if (SIMPLE_TRANSLATIONS[cleanWord] && SIMPLE_TRANSLATIONS[cleanWord][targetLang]) {
          translatedWords.push(SIMPLE_TRANSLATIONS[cleanWord][targetLang]);
          hasTranslations = true;
        } else {
          translatedWords.push(word); // Keep original word if no translation
        }
      }
      
      if (hasTranslations) {
        console.log('✅ Using word-by-word fallback translation');
        return {
          success: true,
          data: {
            translatedText: translatedWords.join(' '),
            sourceLang,
            targetLang,
            originalText: text,
            method: 'word_by_word'
          }
        };
      }
      
      // Try AI-powered translation as final fallback
      console.log('🤖 Trying AI-powered translation as fallback...');
      const aiResult = await translatorApi.translateWithAI(text, sourceLang, targetLang);
      if (aiResult.success) {
        return aiResult;
      }
      
      // Provide detailed error information
      let errorMessage = 'All translation methods failed.';
      let suggestion = `Try translating "${text}" using Google Translate or another service manually.`;
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Translation services timeout - all methods failed.';
        suggestion = 'All translation services are slow. Try again in a moment or use a shorter text.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Translation services blocked by browser security.';
        suggestion = 'Browser security limitations prevent translation. Use Google Translate directly.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Translation service rate limit exceeded.';
        suggestion = 'Too many requests. Wait a moment and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Translation services experiencing issues.';
        suggestion = 'External translation services are having problems. Try again later.';
      }
      
      return {
        success: false,
        error: errorMessage,
        fallbackSuggestion: suggestion,
        fallback: true,
        errorCode: error.code,
        statusCode: error.response?.status
      };
    }
  },

  // Detect language
  detectLanguage: async (text) => {
    console.log(`🔍 Detecting language for: "${text}"`);
    
    try {
      console.log('🌐 Attempting API language detection...');
      const response = await axios.post(`${TRANSLATION_SERVICES[0].baseUrl}/detect`, {
        q: text
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 8000
      });
      
      console.log('✅ API language detection successful:', response.data);
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.warn('⚠️ API language detection failed, using fallback:', error.message);
      
      // Enhanced language detection fallback
      const lowerText = text.toLowerCase();
      let detectedLang = 'en'; // default
      let confidence = 0.5;
      
      // Check for specific language patterns
      const hasLatinChars = /[a-zA-Z]/.test(text);
      const hasCyrillicChars = /[а-яё]/i.test(text);
      const hasChineseChars = /[\u4e00-\u9fff]/.test(text);
      const hasArabicChars = /[\u0600-\u06ff]/.test(text);
      const hasJapaneseChars = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
      const hasKoreanChars = /[\uac00-\ud7af]/.test(text);
      
      // Spanish indicators
      const spanishWords = ['hola', 'gracias', 'por favor', 'sí', 'no', 'cómo', 'qué', 'dónde'];
      const hasSpanishWords = spanishWords.some(word => lowerText.includes(word));
      
      // French indicators
      const frenchWords = ['bonjour', 'merci', 'oui', 'non', 'comment', 'où', 'que'];
      const hasFrenchWords = frenchWords.some(word => lowerText.includes(word));
      
      // German indicators
      const germanWords = ['hallo', 'danke', 'ja', 'nein', 'wie', 'was', 'wo'];
      const hasGermanWords = germanWords.some(word => lowerText.includes(word));
      
      // Determine language based on patterns
      if (hasCyrillicChars) {
        detectedLang = 'ru';
        confidence = 0.9;
      } else if (hasChineseChars) {
        detectedLang = 'zh';
        confidence = 0.9;
      } else if (hasArabicChars) {
        detectedLang = 'ar';
        confidence = 0.9;
      } else if (hasJapaneseChars) {
        detectedLang = 'ja';
        confidence = 0.9;
      } else if (hasKoreanChars) {
        detectedLang = 'ko';
        confidence = 0.9;
      } else if (hasSpanishWords) {
        detectedLang = 'es';
        confidence = 0.8;
      } else if (hasFrenchWords) {
        detectedLang = 'fr';
        confidence = 0.8;
      } else if (hasGermanWords) {
        detectedLang = 'de';
        confidence = 0.8;
      } else if (hasLatinChars) {
        detectedLang = 'en';
        confidence = 0.6;
      }
      
      console.log(`🔄 Fallback detection: ${detectedLang} (${Math.round(confidence * 100)}% confidence)`);
      
      return {
        success: true,
        data: [{ language: detectedLang, confidence }],
        fallback: true
      };
    }
  },

  // Get language name from code
  getLanguageName: (code, languages) => {
    const lang = languages.find(l => l.code === code);
    return lang?.name || code.toUpperCase();
  }
};

export default translatorApi;