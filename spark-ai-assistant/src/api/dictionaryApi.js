// Dictionary API using Free Dictionary API
import axios from 'axios';

const DICTIONARY_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Create axios instance with timeout
const dictionaryClient = axios.create({
  timeout: 8000, // 8 second timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const dictionaryApi = {
  // Search for word definition
  searchWord: async (word) => {
    try {
      console.log(`🔍 Searching dictionary for: "${word}"`);
      const response = await dictionaryClient.get(`${DICTIONARY_BASE_URL}/${word.toLowerCase()}`);
      console.log('✅ Dictionary search successful');
      return {
        success: true,
        data: response.data[0], // Take first result
      };
    } catch (error) {
      console.error('❌ Dictionary search error:', error.message);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Dictionary search timed out. Please try again.'
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Word not found in dictionary'
        };
      }
      
      return {
        success: false,
        error: 'Failed to fetch word definition. Please check your internet connection.'
      };
    }
  },

  // Get pronunciation audio URL
  getPronunciationAudio: (phonetics) => {
    const audioPhonetic = phonetics?.find(p => p.audio && p.audio.length > 0);
    return audioPhonetic?.audio || null;
  },

  // Format phonetic text
  getPhoneticText: (phonetics) => {
    const phoneticWithText = phonetics?.find(p => p.text && p.text.length > 0);
    return phoneticWithText?.text || null;
  },

  // Extract synonyms and antonyms
  getSynonymsAntonyms: (meanings) => {
    const synonyms = new Set();
    const antonyms = new Set();

    meanings?.forEach(meaning => {
      meaning.synonyms?.forEach(syn => synonyms.add(syn));
      meaning.antonyms?.forEach(ant => antonyms.add(ant));
      
      meaning.definitions?.forEach(def => {
        def.synonyms?.forEach(syn => synonyms.add(syn));
        def.antonyms?.forEach(ant => antonyms.add(ant));
      });
    });

    return {
      synonyms: Array.from(synonyms),
      antonyms: Array.from(antonyms)
    };
  }
};

export default dictionaryApi;