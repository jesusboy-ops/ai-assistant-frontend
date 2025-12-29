// Document Summarizer API for File & Document Summarizer
import axiosInstance from './axios';
import { aiApi } from './aiApi';

export const documentSummarizerApi = {
  // AI-powered text summarization (frontend)
  summarizeText: async (text, options = {}) => {
    try {
      console.log('🤖 Starting AI-powered text summarization...');
      console.log(`📝 Text length: ${text.length} characters`);
      
      const { 
        summaryType = 'comprehensive', // comprehensive, brief, bullet-points
        maxLength = 'medium' // short, medium, long
      } = options;
      
      let prompt = '';
      
      switch (summaryType) {
        case 'brief':
          prompt = `Provide a brief summary of the following text in 2-3 sentences:

${text}`;
          break;
        case 'bullet-points':
          prompt = `Summarize the following text as key bullet points:

${text}`;
          break;
        default: // comprehensive
          prompt = `Provide a comprehensive summary of the following text, capturing the main ideas, key points, and important details:

${text}`;
      }
      
      const summary = await aiApi.generateChatResponse(prompt);
      
      const result = {
        success: true,
        data: {
          summary: summary,
          originalLength: text.length,
          summaryLength: summary.length,
          compressionRatio: Math.round((1 - summary.length / text.length) * 100),
          method: 'ai_powered',
          summaryType,
          timestamp: new Date().toISOString(),
          id: Date.now().toString(), // Simple ID for local storage
          originalText: text.substring(0, 200) + (text.length > 200 ? '...' : '') // Store preview
        }
      };
      
      // Save to localStorage for persistence
      try {
        const storedSummaries = localStorage.getItem('spark_ai_summaries');
        const summaries = storedSummaries ? JSON.parse(storedSummaries) : [];
        summaries.unshift(result.data); // Add to beginning
        
        // Keep only last 50 summaries to avoid storage bloat
        if (summaries.length > 50) {
          summaries.splice(50);
        }
        
        localStorage.setItem('spark_ai_summaries', JSON.stringify(summaries));
        console.log('💾 Summary saved to local storage');
      } catch (storageError) {
        console.warn('⚠️ Could not save to localStorage:', storageError);
      }
      
      return result;
    } catch (error) {
      console.error('❌ AI summarization error:', error);
      return {
        success: false,
        error: `AI summarization failed: ${error.message}`
      };
    }
  },

  // Extract key points using AI
  extractKeyPointsAI: async (text) => {
    try {
      console.log('🤖 Extracting key points with AI...');
      
      const prompt = `Extract the key points from the following text and present them as a numbered list:

${text}`;
      
      const keyPoints = await aiApi.generateChatResponse(prompt);
      
      return {
        success: true,
        data: {
          keyPoints: keyPoints,
          method: 'ai_powered',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ AI key points extraction error:', error);
      return {
        success: false,
        error: `Key points extraction failed: ${error.message}`
      };
    }
  },

  // Read and summarize file content (for text files)
  summarizeFile: async (file, options = {}) => {
    try {
      console.log('📄 Processing file for AI summarization:', file.name);
      
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }
      
      // Read file content
      const text = await this.readFileContent(file);
      if (!text) {
        return {
          success: false,
          error: 'Could not read file content or file is empty'
        };
      }
      
      // Summarize the text
      const result = await this.summarizeText(text, options);
      
      if (result.success) {
        result.data.fileName = file.name;
        result.data.fileType = this.getFileTypeDisplay(file);
        result.data.fileSize = file.size;
      }
      
      return result;
    } catch (error) {
      console.error('❌ File summarization error:', error);
      return {
        success: false,
        error: `File summarization failed: ${error.message}`
      };
    }
  },

  // Read file content as text
  readFileContent: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };
      
      // Only read as text for supported text files
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        reject(new Error('File type not supported for direct text extraction. Please use a text file (.txt).'));
      }
    });
  },
  // Upload and summarize document (now uses AI directly)
  summarizeDocument: async (file, options = {}) => {
    try {
      console.log('📄 Processing document for AI summarization:', file.name);
      
      // Validate file
      const validation = documentSummarizerApi.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }
      
      // For text files, read content and use AI directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await documentSummarizerApi.readFileContent(file);
        if (!text) {
          return {
            success: false,
            error: 'Could not read file content or file is empty'
          };
        }
        
        // Use AI to summarize
        const result = await documentSummarizerApi.summarizeText(text, options);
        
        if (result.success) {
          result.data.fileName = file.name;
          result.data.fileType = documentSummarizerApi.getFileTypeDisplay(file);
          result.data.fileSize = file.size;
        }
        
        return result;
      } else {
        // For other file types, inform user about limitation
        return {
          success: false,
          error: 'Currently only text files (.txt) are supported for direct AI summarization. For PDF, DOC, and DOCX files, please copy and paste the text content into the text area above.'
        };
      }
    } catch (error) {
      console.error('❌ Document summarization error:', error);
      return {
        success: false,
        error: `Document summarization failed: ${error.message}`
      };
    }
  },

  // Get document summary by ID
  getSummary: async (summaryId) => {
    try {
      const response = await axiosInstance.get(`/api/documents/summary/${summaryId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch summary'
      };
    }
  },

  // Get all user summaries (now uses local storage as fallback)
  getUserSummaries: async () => {
    try {
      console.log('🔍 Fetching user summaries...');
      
      // Try to get from localStorage as fallback since backend is having issues
      const storedSummaries = localStorage.getItem('spark_ai_summaries');
      const summaries = storedSummaries ? JSON.parse(storedSummaries) : [];
      
      console.log('✅ Retrieved summaries from local storage:', summaries.length);
      return {
        success: true,
        data: summaries,
        source: 'local_storage'
      };
    } catch (error) {
      console.error('❌ Get user summaries error:', error);
      return {
        success: false,
        error: 'Failed to fetch summaries',
        data: []
      };
    }
  },

  // Delete summary (now uses local storage)
  deleteSummary: async (summaryId) => {
    try {
      console.log('🗑️ Deleting summary:', summaryId);
      
      const storedSummaries = localStorage.getItem('spark_ai_summaries');
      const summaries = storedSummaries ? JSON.parse(storedSummaries) : [];
      
      const filteredSummaries = summaries.filter(summary => summary.id !== summaryId);
      
      localStorage.setItem('spark_ai_summaries', JSON.stringify(filteredSummaries));
      
      console.log('✅ Summary deleted from local storage');
      return {
        success: true
      };
    } catch (error) {
      console.error('❌ Delete summary error:', error);
      return {
        success: false,
        error: 'Failed to delete summary'
      };
    }
  },

  // Extract key points from document (now uses AI directly)
  extractKeyPoints: async (file) => {
    try {
      console.log('📄 Processing document for AI key points extraction:', file.name);
      
      // Validate file
      const validation = documentSummarizerApi.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }
      
      // For text files, read content and use AI directly
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await documentSummarizerApi.readFileContent(file);
        if (!text) {
          return {
            success: false,
            error: 'Could not read file content or file is empty'
          };
        }
        
        // Use AI to extract key points
        const result = await documentSummarizerApi.extractKeyPointsAI(text);
        
        if (result.success) {
          result.data.fileName = file.name;
          result.data.fileType = documentSummarizerApi.getFileTypeDisplay(file);
          result.data.fileSize = file.size;
        }
        
        return result;
      } else {
        // For other file types, inform user about limitation
        return {
          success: false,
          error: 'Currently only text files (.txt) are supported for direct AI key points extraction. For PDF, DOC, and DOCX files, please copy and paste the text content into the text area above.'
        };
      }
    } catch (error) {
      console.error('❌ Key points extraction error:', error);
      return {
        success: false,
        error: `Key points extraction failed: ${error.message}`
      };
    }
  },

  // Save summary to notes
  saveToNotes: async (summaryId, noteTitle) => {
    try {
      const response = await axiosInstance.post(`/api/documents/summary/${summaryId}/save-to-notes`, {
        noteTitle
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save summary to notes'
      };
    }
  },

  // Validate file type
  validateFile: (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, or TXT files.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { valid: true };
  },

  // Get file type display name
  getFileTypeDisplay: (file) => {
    const typeMap = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'text/plain': 'TXT'
    };

    return typeMap[file.type] || 'Unknown';
  }
};

export default documentSummarizerApi;