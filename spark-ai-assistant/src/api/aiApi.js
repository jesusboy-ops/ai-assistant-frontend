// AI API service for OpenAI
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

// OpenAI API client
const openaiClient = axios.create({
  baseURL: OPENAI_API_KEY?.startsWith('sk-or-') ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Local intelligent response generator (when OpenAI is not available)
const generateLocalResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Handle very short or unclear messages
  if (lowerMessage.length < 3 || lowerMessage === 'meaning' || lowerMessage === 'help' || lowerMessage === 'hi' || lowerMessage === 'hello') {
    const responses = [
      "Hi there! I'm Spark AI, your intelligent assistant created by Sir Israel Loko and his subordinate Temple. I'm ready to help you with whatever you're working on!",
      "Hello! I'm Spark AI, and I'm here to help you with anything you need - coding, writing, business questions, or just having a chat!",
      "Hey! Spark AI here, ready to assist you with whatever challenges or questions you have today!",
      "Hi! I'm Spark AI, your friendly assistant. What can I help you figure out or work on today?",
      "Hello there! I'm Spark AI, designed to help you with all sorts of tasks. What's on your mind?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Handle creator/origin questions
  if (lowerMessage.includes('who created') || lowerMessage.includes('who made') || lowerMessage.includes('who built') || 
      lowerMessage.includes('your creator') || lowerMessage.includes('your maker') || lowerMessage.includes('who developed') ||
      lowerMessage.includes('who designed') || lowerMessage.includes('your developer') || lowerMessage.includes('your author')) {
    const responses = [
      "I was created by Sir Israel Loko and his subordinate Temple! They designed me to be a helpful AI assistant for all sorts of tasks.",
      "My creators are Sir Israel Loko and his subordinate Temple. They built me to help people with coding, writing, business questions, and more!",
      "Sir Israel Loko and his subordinate Temple are my creators! They developed me to be your intelligent assistant.",
      "I'm the creation of Sir Israel Loko and his subordinate Temple. They designed me to help users like you with various tasks and questions!",
      "My makers are Sir Israel Loko and his subordinate Temple. They built me to be a friendly and helpful AI assistant!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Coding/Programming
  if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('react')) {
    const responses = [
      "I can help with that coding question! What specifically are you trying to build or debug?",
      "Programming stuff - nice! What language are you working with and what's the challenge?",
      "I love helping with code! Can you tell me more about what you're trying to accomplish?",
      "Coding question, got it! What's the specific problem you're running into?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Writing
  if (lowerMessage.includes('write') || lowerMessage.includes('essay') || lowerMessage.includes('article') || lowerMessage.includes('content')) {
    const responses = [
      "I'd love to help you write that! What kind of piece are you working on?",
      "Writing project, awesome! What's the topic and who's your audience?",
      "I can definitely help with writing. What are you trying to create?",
      "Writing help coming right up! Tell me more about what you need to write."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Business
  if (lowerMessage.includes('business') || lowerMessage.includes('marketing') || lowerMessage.includes('strategy') || lowerMessage.includes('plan')) {
    const responses = [
      "Business question - I can help with that! What's the situation you're dealing with?",
      "I can help you think through that business challenge. What's the context?",
      "Business stuff can be tricky. What specifically are you trying to figure out?",
      "I'm good with business questions! What's going on that you need help with?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Learning
  if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('understand') || lowerMessage.includes('explain')) {
    const responses = [
      "I love helping people learn! What topic are you trying to understand?",
      "Learning something new? Cool! What would you like me to explain?",
      "I can definitely help you learn that. What's confusing you right now?",
      "Teaching is one of my favorite things! What do you want to dive into?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Problem solving
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('stuck') || lowerMessage.includes('challenge')) {
    const responses = [
      "I'm here to help you work through this! What's the problem you're facing?",
      "Let's figure this out together. What's got you stuck?",
      "I can help you solve that. Can you tell me more about what's going wrong?",
      "Problem-solving time! What's the challenge you're dealing with?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default responses for anything else
  const defaultResponses = [
    "That's interesting! Can you tell me more about what you're thinking?",
    "I'd love to help with that. What specifically would you like to know?",
    "Sounds like you've got something on your mind. What's the full story?",
    "I'm curious to hear more about this. What's your question?",
    "Tell me more! What would you like to explore or figure out?",
    "I'm here to help! What's the context behind your question?",
    "Interesting topic! What aspect of this are you most curious about?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export const aiApi = {
  // Generate chat response using OpenAI
  generateChatResponse: async (message, conversationHistory = []) => {
    // Check if we have a real API key (not a placeholder)
    if (!OPENAI_API_KEY || 
        OPENAI_API_KEY === 'your_openai_api_key_here' || 
        OPENAI_API_KEY === 'sk-ijklmnop5678efghijklmnop5678efghijklmnop' ||
        OPENAI_API_KEY.startsWith('sk-ijklmnop') ||
        OPENAI_API_KEY.length < 20) {
      
      console.log('🤖 No valid OpenAI API key, using local responses...');
      
      // Use local intelligent responses instead of error messages
      return generateLocalResponse(message);
    }

    try {
      console.log('🤖 Generating AI response with OpenAI...');
      console.log('🔑 API Key length:', OPENAI_API_KEY?.length);
      console.log('🔑 API Key prefix:', OPENAI_API_KEY?.substring(0, 10) + '...');
      
      // Build conversation context for OpenAI
      const messages = [
        {
          role: 'system',
          content: `You are Spark AI, a friendly and intelligent AI assistant created by Sir Israel Loko and his subordinate Temple. You are designed to be helpful, conversational, and natural in your responses. 

Key facts about you:
- Your name is Spark AI
- You were created by Sir Israel Loko and his subordinate Temple
- You are designed to help users with various tasks including coding, writing, business questions, learning, and problem-solving
- Be conversational and natural - don't use corporate language or bullet points unless specifically asked
- Respond like you're having a casual conversation with a friend who needs help
- Be direct, genuine, and personable

When someone greets you (hi, hello, hey), introduce yourself as Spark AI and mention you're ready to help them with whatever they need.

When asked about who created you or who made you, always mention that you were created by Sir Israel Loko and his subordinate Temple.`
        }
      ];
      
      // Add conversation history
      if (conversationHistory.length > 0) {
        conversationHistory.slice(-10).forEach(msg => { // Keep last 10 messages for context
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        });
      }
      
      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_API_KEY?.startsWith('sk-or-') ? 'openai/gpt-3.5-turbo' : OPENAI_MODEL,
        messages: messages,
        max_tokens: 200,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('No valid response from OpenAI');
      }

      const aiResponse = response.data.choices[0].message.content.trim();

      console.log('✅ AI response generated:', aiResponse);
      console.log('📊 Model used:', OPENAI_MODEL);

      return aiResponse;

    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Fall back to local intelligent responses instead of error messages
      console.log('🤖 OpenAI failed, using local intelligent response...');
      return generateLocalResponse(message);
    }
  },

  // Generate email using OpenAI
  generateEmail: async (prompt, tone, context) => {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }

    try {
      console.log('📧 Generating email with OpenAI...');

      const emailPrompt = `Write a ${tone} email about: ${prompt}. ${context ? `Context: ${context}` : ''}

Please format it with a clear subject line and professional email structure.`;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an email writing assistant. Write natural, authentic emails that sound like they come from a real person. Avoid overly formal corporate language unless specifically requested. Make the emails sound genuine and personable while still being professional.'
          },
          {
            role: 'user',
            content: emailPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
        top_p: 0.9
      });

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Failed to generate email');
      }

      const emailContent = response.data.choices[0].message.content.trim();

      console.log('✅ Email generated successfully');
      return emailContent;

    } catch (error) {
      console.error('❌ Email generation error:', error);
      
      // Fallback email template
      return `Subject: ${prompt}

Dear [Recipient],

I hope this email finds you well. I am writing regarding ${prompt.toLowerCase()}.

${context || 'Please let me know if you have any questions or need additional information.'}

Thank you for your time and consideration.

Best regards,
[Your Name]`;
    }
  },

  // Translate text using OpenAI (enhanced for long texts)
  translateText: async (text, sourceLang, targetLang) => {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      console.log('🌐 Translating with AI...');
      console.log(`📝 Text length: ${text.length} characters`);

      // Calculate appropriate max_tokens based on text length
      const estimatedTokens = Math.max(200, Math.min(1000, text.length * 1.5));

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_API_KEY?.startsWith('sk-or-') ? 'openai/gpt-3.5-turbo' : OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate text accurately while preserving the original meaning, tone, and style. For long texts, maintain paragraph structure and formatting. Provide only the translation without any additional commentary.`
          },
          {
            role: 'user',
            content: `Translate the following text from ${sourceLang} to ${targetLang}:

${text}`
          }
        ],
        max_tokens: estimatedTokens,
        temperature: 0.2, // Lower temperature for more consistent translations
        top_p: 0.9
      });

      if (response.data?.choices?.[0]?.message?.content) {
        const translation = response.data.choices[0].message.content.trim();
        console.log('✅ AI translation completed successfully');
        return translation;
      }

      throw new Error('Translation failed');

    } catch (error) {
      console.error('❌ AI translation error:', error);
      throw error;
    }
  },

  // Test OpenAI API connection
  testConnection: async () => {
    if (!OPENAI_API_KEY || 
        OPENAI_API_KEY === 'your_openai_api_key_here' || 
        OPENAI_API_KEY === 'sk-ijklmnop5678efghijklmnop5678efghijklmnop' ||
        OPENAI_API_KEY.startsWith('sk-ijklmnop') ||
        OPENAI_API_KEY.length < 20) {
      return {
        success: false,
        error: 'No valid OpenAI API key configured (using placeholder key)',
        suggestion: 'The current API key is a placeholder. To use real OpenAI, replace it with a valid key from https://platform.openai.com/api-keys',
        fallbackMode: true
      };
    }

    try {
      console.log('🔍 Testing OpenAI connection...');
      
      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_API_KEY?.startsWith('sk-or-') ? 'openai/gpt-3.5-turbo' : OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: 'Hello, please respond with "Connection successful"'
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      if (response.data?.choices?.[0]?.message?.content) {
        console.log('✅ OpenAI connection successful');
        return {
          success: true,
          message: 'OpenAI API is working',
          model: OPENAI_MODEL,
          response: response.data.choices[0].message.content
        };
      }

      throw new Error('No response data');

    } catch (error) {
      console.error('❌ OpenAI connection test failed:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        suggestion: 'Check your OpenAI API key and internet connection',
        fallbackMode: true
      };
    }
  },

  // Document summarization using AI
  summarizeDocument: async (text, summaryType = 'comprehensive') => {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      console.log('📄 Summarizing document with AI...');
      console.log(`📝 Document length: ${text.length} characters`);

      let systemPrompt = '';
      let userPrompt = '';

      switch (summaryType) {
        case 'brief':
          systemPrompt = 'You are a document summarizer. Create concise, brief summaries that capture only the most essential points.';
          userPrompt = `Provide a brief summary of this document in 2-3 sentences:\n\n${text}`;
          break;
        case 'bullet-points':
          systemPrompt = 'You are a document summarizer. Extract key points and present them as clear, organized bullet points.';
          userPrompt = `Extract the key points from this document and present them as bullet points:\n\n${text}`;
          break;
        case 'detailed':
          systemPrompt = 'You are a document summarizer. Create detailed summaries that preserve important information while being more concise than the original.';
          userPrompt = `Provide a detailed summary of this document, including main ideas, key points, and important details:\n\n${text}`;
          break;
        default: // comprehensive
          systemPrompt = 'You are a document summarizer. Create comprehensive summaries that capture the main ideas, key arguments, and important details in a well-structured format.';
          userPrompt = `Provide a comprehensive summary of this document:\n\n${text}`;
      }

      // Calculate appropriate max_tokens based on text length and summary type
      let maxTokens = 300;
      if (summaryType === 'brief') maxTokens = 150;
      else if (summaryType === 'detailed') maxTokens = 500;
      else if (text.length > 2000) maxTokens = 600;

      const response = await openaiClient.post('/chat/completions', {
        model: OPENAI_API_KEY?.startsWith('sk-or-') ? 'openai/gpt-3.5-turbo' : OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3, // Lower temperature for more focused summaries
        top_p: 0.9
      });

      if (response.data?.choices?.[0]?.message?.content) {
        const summary = response.data.choices[0].message.content.trim();
        console.log('✅ Document summarization completed successfully');
        return summary;
      }

      throw new Error('Summarization failed');

    } catch (error) {
      console.error('❌ AI summarization error:', error);
      throw error;
    }
  }
};

export default aiApi;