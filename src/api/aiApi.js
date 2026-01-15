// AI API service for OpenAI/OpenRouter
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

// Debug logging for API key
console.log('🔑 API Key Status:', {
  exists: !!OPENAI_API_KEY,
  length: OPENAI_API_KEY?.length,
  startsWithSk: OPENAI_API_KEY?.startsWith('sk-'),
  isPlaceholder: OPENAI_API_KEY === 'your_openrouter_api_key_here'
});

// Check if API key is properly configured
const isApiKeyConfigured = () => {
  const isConfigured = OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openrouter_api_key_here' && OPENAI_API_KEY.length > 10;
  console.log('🔑 isApiKeyConfigured:', isConfigured);
  return isConfigured;
};

// OpenAI/OpenRouter API client
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
  // No timeout - let AI requests complete naturally
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
  
  // Handle greetings
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage === 'hi' || lowerMessage === 'hello') {
    return "Hi there! I'm Spark AI, your intelligent assistant created by Sir Israel Loko and his subordinate Temple. I'm here to help you with coding, writing, business questions, learning, problem-solving, and much more. What can I help you with today?";
  }
  
  // Handle creator/origin questions
  if (lowerMessage.includes('who created') || lowerMessage.includes('who made') || lowerMessage.includes('who built') || 
      lowerMessage.includes('your creator') || lowerMessage.includes('your maker') || lowerMessage.includes('who developed') ||
      lowerMessage.includes('who designed') || lowerMessage.includes('your developer') || lowerMessage.includes('your author')) {
    return "I was created by Sir Israel Loko and his subordinate Temple! They designed me to be a helpful AI assistant for all sorts of tasks including coding, writing, business strategy, learning, and problem-solving. I'm here to help you accomplish whatever you're working on!";
  }
  
  // Handle coding questions
  if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || 
      lowerMessage.includes('python') || lowerMessage.includes('react') || lowerMessage.includes('html') || 
      lowerMessage.includes('css') || lowerMessage.includes('function') || lowerMessage.includes('variable') ||
      lowerMessage.includes('array') || lowerMessage.includes('object') || lowerMessage.includes('api')) {
    
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('debug') || lowerMessage.includes('not working')) {
      return "I'd love to help you debug that! Debugging can be tricky, but we can figure it out together. Can you share the specific error message you're seeing, or describe what's happening versus what you expected? Also, what programming language and environment are you working in? The more details you can provide, the better I can help you solve this.";
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('start') || lowerMessage.includes('beginner')) {
      return "Learning to code is an exciting journey! There are many great paths depending on what you want to build. Are you interested in web development (HTML, CSS, JavaScript), mobile apps, data science with Python, or something else? Also, do you have any programming experience already, or are you starting completely fresh? I can recommend the best learning path based on your goals.";
    } else if (lowerMessage.includes('react')) {
      return "React is a fantastic library for building user interfaces! Are you working on a specific React project, learning React for the first time, or running into a particular challenge? I can help with components, state management, hooks, routing, or any other React concepts you're curious about.";
    } else if (lowerMessage.includes('javascript')) {
      return "JavaScript is such a versatile language! Whether you're working on frontend, backend with Node.js, or just learning the fundamentals, I'm here to help. What specific aspect of JavaScript are you working with? Are you dealing with functions, objects, async programming, DOM manipulation, or something else?";
    } else if (lowerMessage.includes('python')) {
      return "Python is amazing for so many things - web development, data science, automation, and more! What are you using Python for, or what would you like to learn about? I can help with syntax, libraries like pandas or numpy, web frameworks like Django or Flask, or any specific Python challenges you're facing.";
    } else {
      return "I love helping with coding questions! Programming can be challenging but also incredibly rewarding. What specific programming challenge are you working on? If you can share details about the language you're using and what you're trying to accomplish, I can give you much more targeted help and guidance.";
    }
  }
  
  // Handle business questions
  if (lowerMessage.includes('business') || lowerMessage.includes('marketing') || lowerMessage.includes('strategy') || 
      lowerMessage.includes('startup') || lowerMessage.includes('entrepreneur') || lowerMessage.includes('plan') ||
      lowerMessage.includes('customers') || lowerMessage.includes('sales') || lowerMessage.includes('revenue')) {
    
    if (lowerMessage.includes('startup') || lowerMessage.includes('start a business')) {
      return "Starting a business is exciting and challenging! The key is to start with a clear understanding of the problem you're solving and who you're solving it for. What kind of business are you thinking about, and what stage are you at? Are you still in the idea phase, validating your concept, or ready to build? I can help you think through market research, business models, funding options, and the key steps to get started.";
    } else if (lowerMessage.includes('marketing') || lowerMessage.includes('customers')) {
      return "Marketing is all about understanding your customers deeply and reaching them where they are! The best marketing feels helpful rather than pushy. What type of business or product are you marketing, and who's your target audience? Are you looking for help with digital marketing, content strategy, social media, email marketing, or something else? I can help you develop a strategy that actually connects with your customers.";
    } else {
      return "Business challenges often have creative solutions when you approach them systematically! What specific business situation are you dealing with? Whether it's strategy, operations, marketing, finance, or team management, I'd love to help you think through it. The more context you can give me about your business and the challenge you're facing, the better I can help you brainstorm solutions.";
    }
  }
  
  // Handle writing questions
  if (lowerMessage.includes('write') || lowerMessage.includes('writing') || lowerMessage.includes('essay') || 
      lowerMessage.includes('article') || lowerMessage.includes('content') || lowerMessage.includes('blog') ||
      lowerMessage.includes('story') || lowerMessage.includes('letter') || lowerMessage.includes('email')) {
    
    if (lowerMessage.includes('essay') || lowerMessage.includes('academic')) {
      return "Academic writing has its own style and structure, but the key is always clear thinking and good organization! What's the topic of your essay, and what type of assignment is it? Is it argumentative, analytical, research-based, or something else? Also, what's your target length and who's your audience? I can help you with everything from brainstorming and outlining to structuring your arguments and polishing your prose.";
    } else if (lowerMessage.includes('blog') || lowerMessage.includes('article') || lowerMessage.includes('content')) {
      return "Great content writing is all about providing value to your readers while staying true to your voice! What's your topic, and who are you writing for? Are you looking to inform, persuade, entertain, or inspire? The best content answers questions your audience actually has. I can help you brainstorm ideas, structure your piece, develop your arguments, and make your writing more engaging.";
    } else if (lowerMessage.includes('email')) {
      return "Email writing is an art - you want to be clear, concise, and considerate of your reader's time! What kind of email are you writing? Is it professional correspondence, marketing, a personal message, or something else? Who's your audience and what's your main goal? I can help you craft emails that get read, understood, and acted upon.";
    } else {
      return "Writing is one of the most powerful skills you can develop! Whether you're working on creative writing, business communication, or academic work, good writing is about clarity, purpose, and connecting with your reader. What type of writing project are you working on, and what's the main message you want to get across? I'd love to help you make your writing more effective and engaging.";
    }
  }
  
  // Handle learning questions
  if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('understand') || 
      lowerMessage.includes('explain') || lowerMessage.includes('teach me') || lowerMessage.includes('how to')) {
    
    let subject = lowerMessage.replace(/learn|study|understand|explain|teach me|how to|about/g, '').trim();
    if (subject && subject.length > 2) {
      return `I'd love to help you learn about ${subject}! Learning is most effective when it's tailored to your goals and current knowledge. What's your current experience with ${subject}, and what specifically would you like to understand better? Are you looking for a broad overview, diving deep into particular aspects, or trying to solve a specific problem? The more I know about what you're trying to achieve, the better I can guide your learning.`;
    } else {
      return "I love helping people learn new things! Learning is one of life's greatest adventures. What topic are you interested in exploring? Whether it's technical skills, creative pursuits, business knowledge, or just satisfying your curiosity about how things work, I'm here to help. What's driving your interest in learning this - is it for work, a personal project, or just general curiosity?";
    }
  }
  
  // Handle math and calculations
  if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || lowerMessage.includes('equation') || 
      lowerMessage.includes('formula') || /\d+[\+\-\*\/]\d+/.test(lowerMessage) || lowerMessage.includes('solve')) {
    return "I can definitely help with math problems! Whether it's basic arithmetic, algebra, calculus, statistics, or applied math for real-world problems, I'm here to help. If you have a specific calculation or equation, feel free to share it. For more complex problems, it helps if you can explain what you're trying to figure out and what context this is for. I can walk you through the steps and explain the reasoning behind the solution.";
  }
  
  // Handle technology questions
  if (lowerMessage.includes('software') || lowerMessage.includes('app') || lowerMessage.includes('tool') || 
      lowerMessage.includes('technology') || lowerMessage.includes('computer') || lowerMessage.includes('digital')) {
    return "Technology questions are great! The right tools can make such a difference in productivity and creativity. Are you looking for recommendations for specific software or tools, help with using something you already have, or trying to understand how a particular technology works? Whether it's productivity apps, creative software, development tools, or just understanding how things work under the hood, I'm here to help you navigate the tech landscape.";
  }
  
  // Handle problem-solving questions
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('stuck') || 
      lowerMessage.includes('challenge') || lowerMessage.includes('help me') || lowerMessage.includes('difficult')) {
    return "I'm here to help you work through whatever challenge you're facing! Problem-solving is often about breaking things down into manageable pieces and approaching them systematically. What specific situation are you dealing with? What have you already tried, and where exactly are you getting stuck? Sometimes just talking through a problem with someone can help you see new angles and solutions.";
  }
  
  // Handle creative questions
  if (lowerMessage.includes('creative') || lowerMessage.includes('design') || lowerMessage.includes('art') || 
      lowerMessage.includes('music') || lowerMessage.includes('video') || lowerMessage.includes('photography')) {
    return "Creativity is such a wonderful part of being human! Whether you're working on visual design, music, writing, video, or any other creative pursuit, I'd love to help you explore your ideas. What kind of creative project are you working on? Are you looking for inspiration, technical guidance, feedback on ideas, or help overcoming creative blocks? Creativity often flourishes when you have someone to bounce ideas off of.";
  }
  
  // Handle very short or unclear messages
  if (lowerMessage.length < 3 || lowerMessage === 'meaning' || lowerMessage === 'help' || lowerMessage === 'what') {
    return "I'm Spark AI, and I'm here to help you with whatever you're working on! I can assist with coding and programming, writing and content creation, business strategy and marketing, learning new skills, solving problems, creative projects, and much more. What would you like to explore or work on today? The more specific you can be, the better I can help you.";
  }
  
  // Default intelligent response
  const intelligentResponses = [
    "That's a fascinating topic! I'd love to dive deeper into this with you. Could you give me a bit more context about what specifically you're curious about or trying to accomplish? The more details you share, the better I can tailor my help to exactly what you need.",
    
    "Interesting question! I'm here to help you explore this further. What's the context behind your question, and what would be most helpful for you to know? Whether you're looking for practical advice, theoretical understanding, or step-by-step guidance, I can adapt my response to what works best for you.",
    
    "I'd be happy to help you with that! To give you the most useful and relevant response, could you tell me more about your specific situation or what aspect of this you're most interested in? I want to make sure I'm addressing exactly what you need.",
    
    "Great question! I can definitely help you figure this out. What's the bigger picture here - what are you working on or trying to understand? Knowing your goals and context helps me provide much more targeted and useful guidance.",
    
    "That's something I can definitely assist with! To give you the best possible help, could you share more about your specific needs, goals, or the challenge you're facing? I'm here to provide practical, actionable guidance tailored to your situation.",
    
    "I'm ready to help you work through this! What's prompting this question, and what kind of outcome are you hoping for? Whether you need strategic thinking, practical steps, creative ideas, or technical guidance, I can adapt my approach to what serves you best.",
    
    "Excellent topic to explore! I want to make sure I give you exactly the kind of help that's most valuable to you. Could you tell me more about what you're trying to achieve or what specific aspect of this you'd like to focus on? I'm here to provide thoughtful, practical guidance."
  ];
  
  return intelligentResponses[Math.floor(Math.random() * intelligentResponses.length)];
};

export const aiApi = {
  // Generate chat response using OpenAI/OpenRouter
  generateChatResponse: async (message, conversationHistory = []) => {
    // Check if API key is configured
    if (!isApiKeyConfigured()) {
      console.error('❌ OpenRouter API key not configured');
      throw new Error('AI service is not configured. Please set up your OpenRouter API key in the environment variables.');
    }

    try {
      console.log('🤖 Generating AI response with OpenRouter...');
      console.log('🔑 API Key configured:', isApiKeyConfigured());
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
- Be conversational and natural - respond like you're having a helpful conversation
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
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      console.log('📤 Sending request to OpenRouter API:', {
        model: requestData.model,
        messageCount: messages.length,
        userMessage: message
      });

      // Direct API call without timeout
      const response = await openaiClient.post('/chat/completions', requestData);

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
      
      // Handle API errors
      if (error.response?.status === 401) {
        throw new Error('AI API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('AI API rate limit exceeded. Please try again later.');
      } else if (error.response?.status >= 500) {
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
        model: 'openai/gpt-3.5-turbo',
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

      // Direct API call without timeout
      const response = await openaiClient.post('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
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
    try {
      console.log('🔍 Testing OpenRouter connection...');
      
      const response = await openaiClient.post('/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
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
        console.log('✅ OpenRouter connection successful');
        return {
          success: true,
          message: 'OpenRouter API is working',
          model: 'openai/gpt-3.5-turbo',
          response: response.data.choices[0].message.content
        };
      }

      throw new Error('No response data');

    } catch (error) {
      console.error('❌ OpenRouter connection test failed:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        suggestion: 'Check your OpenRouter API key and internet connection'
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
        model: 'openai/gpt-3.5-turbo',
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