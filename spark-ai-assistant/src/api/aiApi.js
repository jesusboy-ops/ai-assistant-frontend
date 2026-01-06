// AI API service for OpenAI
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

// OpenAI API client
const openaiClient = axios.create({
  baseURL: OPENAI_API_KEY?.startsWith('sk-or-') ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    ...(OPENAI_API_KEY?.startsWith('sk-or-') && {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Spark AI Assistant'
    })
  },
  timeout: 15000 // 15 second timeout (reduced from 30s)
});

// Add request interceptor for debugging
openaiClient.interceptors.request.use(
  (config) => {
    console.log('🔄 AI API Request:', {
      url: config.baseURL + config.url,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? '[REDACTED]' : 'Missing'
      }
    });
    return config;
  },
  (error) => {
    console.error('🔄 AI API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
openaiClient.interceptors.response.use(
  (response) => {
    console.log('✅ AI API Response:', {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ AI API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

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
  
  // Handle specific questions with actual answers
  if (lowerMessage.includes('what is') || lowerMessage.includes('what are') || lowerMessage.includes('define') || lowerMessage.includes('meaning of')) {
    // Extract the topic they're asking about
    let topic = lowerMessage.replace(/what is|what are|define|meaning of|the|a|an/g, '').trim();
    if (topic) {
      return `I'd be happy to explain ${topic} for you! ${topic} is a concept that can have different meanings depending on the context. Could you tell me more specifically what aspect of ${topic} you're interested in? For example, are you looking for a technical definition, practical applications, or something else?`;
    }
  }
  
  // Handle how-to questions
  if (lowerMessage.includes('how to') || lowerMessage.includes('how do i') || lowerMessage.includes('how can i')) {
    let task = lowerMessage.replace(/how to|how do i|how can i/g, '').trim();
    if (task) {
      return `Great question about ${task}! I can definitely help you with that. To give you the most useful guidance, could you tell me a bit more about your specific situation? For example, what's your current experience level with this, and what's your end goal?`;
    }
  }
  
  // Handle why questions
  if (lowerMessage.includes('why') || lowerMessage.includes('reason')) {
    return `That's a thoughtful question! The reasons behind things can be complex and often depend on context. I'd love to explore this with you - could you give me a bit more detail about what specifically you're curious about? That way I can provide a more targeted explanation.`;
  }
  
  // Handle comparison questions
  if (lowerMessage.includes('vs') || lowerMessage.includes('versus') || lowerMessage.includes('difference between') || lowerMessage.includes('compare')) {
    return `Comparisons can be really helpful for understanding! I'd be happy to break down the differences and similarities for you. Could you tell me more about what specific aspects you're most interested in comparing? That way I can focus on what matters most to you.`;
  }
  
  // Coding/Programming with more specific responses
  if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('react') || lowerMessage.includes('function') || lowerMessage.includes('bug') || lowerMessage.includes('debug')) {
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('debug') || lowerMessage.includes('not working')) {
      return `Debugging can be tricky! I'd love to help you figure out what's going wrong. Could you share the specific error message you're seeing, or describe what's happening versus what you expected? Also, what programming language and environment are you working in?`;
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('start') || lowerMessage.includes('beginner')) {
      return `Learning to code is exciting! There are lots of great paths depending on what you want to build. Are you interested in web development, mobile apps, data science, or something else? And do you have any programming experience already, or are you starting completely fresh?`;
    } else {
      return `I love helping with coding questions! What specific programming challenge are you working on? If you can share some details about the language you're using and what you're trying to accomplish, I can give you much more targeted help.`;
    }
  }
  
  // Writing with more specific responses
  if (lowerMessage.includes('write') || lowerMessage.includes('essay') || lowerMessage.includes('article') || lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('story') || lowerMessage.includes('letter')) {
    if (lowerMessage.includes('essay') || lowerMessage.includes('academic')) {
      return `Academic writing has its own style and structure! What's the topic of your essay, and what type of assignment is it (argumentative, analytical, research-based, etc.)? Also, what's your target length and who's your audience?`;
    } else if (lowerMessage.includes('blog') || lowerMessage.includes('article')) {
      return `Content writing is all about connecting with your audience! What's your topic, and who are you writing for? Are you looking to inform, persuade, entertain, or something else? The more I know about your goals, the better I can help you craft something engaging.`;
    } else {
      return `I'd love to help you with your writing project! What type of piece are you working on, and what's the main message you want to get across? Also, who's your intended audience? These details will help me give you much more useful guidance.`;
    }
  }
  
  // Business with more specific responses
  if (lowerMessage.includes('business') || lowerMessage.includes('marketing') || lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('startup') || lowerMessage.includes('entrepreneur')) {
    if (lowerMessage.includes('startup') || lowerMessage.includes('start a business')) {
      return `Starting a business is exciting! What kind of business are you thinking about, and what stage are you at? Are you still in the idea phase, or do you have a concept you're ready to validate? I can help you think through the key steps and considerations.`;
    } else if (lowerMessage.includes('marketing') || lowerMessage.includes('customers')) {
      return `Marketing is all about understanding your customers and reaching them effectively! What type of business or product are you marketing, and who's your target audience? Are you looking for help with strategy, specific tactics, or measuring results?`;
    } else {
      return `Business challenges can be complex, but they're often solvable with the right approach! What specific situation are you dealing with? The more context you can give me about your business, your goals, and the challenge you're facing, the better I can help you think it through.`;
    }
  }
  
  // Learning with more specific responses
  if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('understand') || lowerMessage.includes('explain') || lowerMessage.includes('teach me')) {
    let subject = lowerMessage.replace(/learn|study|understand|explain|teach me|about|how to/g, '').trim();
    if (subject) {
      return `I'd love to help you learn about ${subject}! Learning is most effective when it's tailored to your goals and current knowledge. What's your current experience with ${subject}, and what specifically would you like to understand better? Are you looking for a broad overview or diving deep into particular aspects?`;
    } else {
      return `I love helping people learn new things! What topic are you interested in exploring? And what's driving your curiosity - is this for work, a personal project, or just general interest? Knowing your motivation helps me explain things in the most useful way.`;
    }
  }
  
  // Problem solving with more specific responses
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('stuck') || lowerMessage.includes('challenge') || lowerMessage.includes('help me')) {
    return `I'm here to help you work through whatever you're facing! Problem-solving is often about breaking things down into manageable pieces. Could you tell me more about the specific situation? What have you already tried, and where exactly are you getting stuck?`;
  }
  
  // Math and calculations
  if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('formula') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
    return `I can help with math problems! If you have a specific calculation or equation, feel free to share it. For more complex problems, it helps if you can explain what you're trying to figure out and what context this is for (homework, work project, personal calculation, etc.).`;
  }
  
  // Technology and tools
  if (lowerMessage.includes('software') || lowerMessage.includes('app') || lowerMessage.includes('tool') || lowerMessage.includes('technology') || lowerMessage.includes('computer')) {
    return `Technology questions are great! Are you looking for recommendations for specific tools, help with using software you already have, or trying to understand how something works? The more specific you can be about what you're trying to accomplish, the better I can point you in the right direction.`;
  }
  
  // Default responses that encourage more specific questions
  const defaultResponses = [
    "That's an interesting topic! I'd love to dive deeper into this with you. Could you give me a bit more context about what specifically you're curious about or trying to accomplish?",
    "I'm here to help with that! To give you the most useful response, could you tell me more about your specific situation or what aspect of this you're most interested in?",
    "Great question! I can definitely help you explore this further. What's the context behind your question, and what would be most helpful for you to know?",
    "I'd be happy to help you with that! Could you share a bit more detail about what you're working on or what specific information would be most valuable to you?",
    "Interesting! I want to make sure I give you the most relevant help. Could you tell me more about what prompted this question or what you're hoping to achieve?",
    "I'm ready to help you figure this out! What's the bigger picture here - what are you working on or trying to understand?",
    "That's something I can definitely assist with! To give you the best guidance, could you share more about your specific needs or goals?"
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
      console.log('🤖 Generating AI response with OpenRouter/OpenAI...');
      console.log('🔑 API Key length:', OPENAI_API_KEY?.length);
      console.log('🔑 API Key prefix:', OPENAI_API_KEY?.substring(0, 15) + '...');
      console.log('🔑 Using OpenRouter:', OPENAI_API_KEY?.startsWith('sk-or-'));
      
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
- Provide helpful, detailed answers to questions
- If you don't know something specific, be honest about it but offer to help in other ways

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

      const requestData = {
        model: OPENAI_API_KEY?.startsWith('sk-or-') ? 'openai/gpt-3.5-turbo' : OPENAI_MODEL,
        messages: messages,
        max_tokens: 500, // Increased for more detailed responses
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      console.log('📤 Sending request to AI API:', {
        model: requestData.model,
        messageCount: messages.length,
        userMessage: message
      });

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Chat response timeout')), 25000); // 25 second timeout
      });

      // Create the API request promise
      const apiPromise = openaiClient.post('/chat/completions', requestData);

      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);

      console.log('📥 Raw API response:', {
        status: response.status,
        hasChoices: !!response.data?.choices,
        choicesLength: response.data?.choices?.length,
        hasContent: !!response.data?.choices?.[0]?.message?.content
      });

      if (!response.data?.choices?.[0]?.message?.content) {
        console.error('❌ No valid response content from API');
        throw new Error('No valid response from AI API');
      }

      const aiResponse = response.data.choices[0].message.content.trim();

      console.log('✅ AI response generated successfully:', aiResponse.substring(0, 100) + '...');
      console.log('📊 Model used:', requestData.model);

      return aiResponse;

    } catch (error) {
      console.error('❌ AI API error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Handle timeout errors
      if (error.message === 'Chat response timeout') {
        console.error('❌ Chat response timed out');
        throw new Error('AI response timed out. Please try again with a shorter message.');
      }
      
      // If it's a network error or API error, throw it to be handled by the calling function
      if (error.response?.status === 401) {
        console.error('❌ Authentication failed - API key may be invalid');
        throw new Error('AI API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        console.error('❌ Rate limit exceeded');
        throw new Error('AI API rate limit exceeded. Please try again later.');
      } else if (error.response?.status >= 500) {
        console.error('❌ Server error');
        throw new Error('AI API server error. Please try again later.');
      }
      
      // For other errors, throw them to be handled by the calling function
      throw error;
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

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Translation timeout')), 12000); // 12 second timeout
      });

      // Create the API request promise
      const apiPromise = openaiClient.post('/chat/completions', {
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

      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);

      if (response.data?.choices?.[0]?.message?.content) {
        const translation = response.data.choices[0].message.content.trim();
        console.log('✅ AI translation completed successfully');
        return translation;
      }

      throw new Error('Translation failed');

    } catch (error) {
      console.error('❌ AI translation error:', error);
      
      if (error.message === 'Translation timeout') {
        throw new Error('Translation timed out. Please try again with shorter text.');
      }
      
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