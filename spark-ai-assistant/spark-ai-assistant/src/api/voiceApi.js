// Voice API service for TTS and STT
import axiosInstance from './axios';

export const voiceApi = {
  // Text-to-speech - convert text to audio
  textToSpeech: async (text, voice = 'alloy') => {
    const response = await axiosInstance.post(
      '/api/voice/text-to-speech',
      { text, voice },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Speech-to-text - convert audio to text
  speechToText: async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await axiosInstance.post('/api/voice/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get available voices
  getVoices: async () => {
    const response = await axiosInstance.get('/api/voice/voices');
    return response.data;
  }
};

export default voiceApi;
