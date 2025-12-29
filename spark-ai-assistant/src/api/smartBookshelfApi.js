// Smart Bookshelf API - AI-powered reading and productivity system
import { aiApi } from './aiApi';
import { openLibraryApi } from './openLibraryApi';

export const smartBookshelfApi = {
  // AI-powered book recommendations based on user context + Open Library data
  getPersonalizedRecommendations: async (userContext) => {
    try {
      console.log('🤖 Generating personalized book recommendations...');
      
      const { tasks, notes, goals, recentActivity } = userContext;
      
      // First, get AI analysis of what the user needs
      const prompt = `Based on this user's current context, identify 2-3 book categories and specific topics that would be most helpful:

Current Tasks: ${tasks?.slice(0, 5).map(t => t.title).join(', ') || 'None'}
Recent Notes Topics: ${notes?.slice(0, 3).map(n => n.title).join(', ') || 'None'}
Goals: ${goals?.join(', ') || 'General productivity'}

Respond with specific search terms for books, focusing on:
1. Productivity & Focus
2. Career & Skills  
3. Communication & Writing
4. Thinking & Mental Models
5. Technology & AI

Format as: category1:search_term1,search_term2|category2:search_term3,search_term4`;

      const aiResponse = await aiApi.generateChatResponse(prompt);
      
      // Parse AI response and search Open Library
      const recommendations = [];
      
      // Also get some curated classics
      const classicsResult = await openLibraryApi.getProductivityClassics();
      if (classicsResult.success) {
        recommendations.push(...classicsResult.data.books.slice(0, 2));
      }
      
      // Get category-based recommendations
      const categories = ['productivity', 'career', 'communication'];
      for (const category of categories) {
        const categoryResult = await openLibraryApi.getCuratedRecommendations(category);
        if (categoryResult.success) {
          recommendations.push(...categoryResult.data.books.slice(0, 1));
        }
      }
      
      // Enhance with AI reasoning
      const enhancedRecommendations = recommendations.slice(0, 4).map(book => ({
        ...book,
        reason: this.generateRecommendationReason(book, userContext),
        keyInsight: this.generateKeyInsight(book),
        coverUrl: openLibraryApi.getCoverUrl(book.coverId, 'M')
      }));
      
      return {
        success: true,
        data: enhancedRecommendations
      };
    } catch (error) {
      console.error('❌ Book recommendations error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate AI reasoning for book recommendations
  generateRecommendationReason: (book, userContext) => {
    const reasons = [
      `Perfect for your current focus on ${userContext.tasks?.[0]?.title || 'productivity'}`,
      `Aligns with your recent notes about ${userContext.notes?.[0]?.title || 'improvement'}`,
      `Essential reading for your goals in ${userContext.goals?.[0] || 'personal development'}`,
      `Highly recommended for building skills in ${book.subjects?.[0] || 'this area'}`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  // Generate key insights for books
  generateKeyInsight: (book) => {
    const insights = {
      'Deep Work': 'Time-blocking for deep work sessions',
      'Atomic Habits': 'Start with 1% improvements daily',
      'Getting Things Done': 'Capture everything in a trusted system',
      'Thinking, Fast and Slow': 'Recognize System 1 vs System 2 thinking'
    };
    
    return insights[book.title] || 'Practical frameworks you can apply immediately';
  },

  // Search books using Open Library
  searchBooks: async (query, options = {}) => {
    try {
      console.log('🔍 Searching for books:', query);
      
      const result = await openLibraryApi.searchBooks(query, options);
      
      if (result.success) {
        // Enhance books with cover URLs and AI categorization
        const enhancedBooks = result.data.books.map(book => ({
          ...book,
          coverUrl: openLibraryApi.getCoverUrl(book.coverId, 'M'),
          category: this.categorizeBook(book),
          addedAt: new Date().toISOString()
        }));
        
        return {
          success: true,
          data: {
            ...result.data,
            books: enhancedBooks
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Book search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Categorize books based on subjects and title
  categorizeBook: (book) => {
    const subjects = (book.subjects || []).join(' ').toLowerCase();
    const title = book.title.toLowerCase();
    
    if (subjects.includes('business') || subjects.includes('management') || subjects.includes('leadership')) {
      return 'career';
    } else if (subjects.includes('psychology') || subjects.includes('philosophy') || title.includes('thinking')) {
      return 'thinking';
    } else if (subjects.includes('communication') || subjects.includes('writing')) {
      return 'communication';
    } else if (subjects.includes('technology') || subjects.includes('computer')) {
      return 'technology';
    } else {
      return 'productivity';
    }
  },

  // Get book details from Open Library
  getBookDetails: async (bookId) => {
    try {
      console.log('📖 Fetching book details:', bookId);
      
      const result = await openLibraryApi.getBookDetails(bookId);
      
      if (result.success) {
        const book = result.data;
        return {
          success: true,
          data: {
            ...book,
            coverUrl: openLibraryApi.getCoverUrl(book.coverId, 'L'),
            category: this.categorizeBook(book)
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Book details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get trending books
  getTrendingBooks: async () => {
    try {
      console.log('🔥 Fetching trending books...');
      
      const result = await openLibraryApi.getTrendingBooks({ limit: 12 });
      
      if (result.success) {
        const enhancedBooks = result.data.books.map(book => ({
          ...book,
          coverUrl: openLibraryApi.getCoverUrl(book.coverId, 'M'),
          category: this.categorizeBook(book)
        }));
        
        return {
          success: true,
          data: {
            ...result.data,
            books: enhancedBooks
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Trending books error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Process book content and extract insights
  processBookContent: async (bookContent, bookMetadata) => {
    try {
      console.log('📚 Processing book content for insights...');
      
      const prompt = `Analyze this book content and extract key insights:

Book: ${bookMetadata.title} by ${bookMetadata.author}
Category: ${bookMetadata.category}

Content: ${bookContent.substring(0, 3000)}...

Extract:
1. 5 key insights that can be applied immediately
2. 3 actionable takeaways
3. Connection to productivity/career/communication goals
4. Suggested next steps for implementation

Format as structured data.`;

      const insights = await aiApi.generateChatResponse(prompt);
      
      return {
        success: true,
        data: {
          insights: insights,
          processedAt: new Date().toISOString(),
          bookId: bookMetadata.id
        }
      };
    } catch (error) {
      console.error('❌ Book processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Convert highlights to actionable items
  convertHighlightToAction: async (highlight, actionType, context) => {
    try {
      console.log(`🎯 Converting highlight to ${actionType}...`);
      
      let prompt = '';
      
      switch (actionType) {
        case 'note':
          prompt = `Convert this book highlight into a structured note:

Highlight: "${highlight.text}"
Book: ${highlight.bookTitle}
Context: ${context}

Create a note with:
1. Clear title
2. Key insight
3. Personal reflection
4. How it applies to current goals
5. Next steps`;
          break;
          
        case 'task':
          prompt = `Convert this book highlight into actionable tasks:

Highlight: "${highlight.text}"
Book: ${highlight.bookTitle}
Context: ${context}

Create 1-3 specific, actionable tasks that implement this insight.
Each task should be:
- Specific and measurable
- Time-bound
- Connected to the insight`;
          break;
          
        case 'email':
          prompt = `Convert this book insight into an email to share with team/colleagues:

Highlight: "${highlight.text}"
Book: ${highlight.bookTitle}

Create a professional email that:
- Shares the insight clearly
- Explains why it's valuable
- Suggests how the team could apply it
- Keeps it concise and actionable`;
          break;
      }
      
      const result = await aiApi.generateChatResponse(prompt);
      
      return {
        success: true,
        data: {
          type: actionType,
          content: result,
          sourceHighlight: highlight,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Highlight conversion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get reading intelligence and progress insights
  getReadingIntelligence: async (bookId, readingData) => {
    try {
      console.log('📊 Analyzing reading intelligence...');
      
      const { highlights, notes, timeSpent, progress } = readingData;
      
      const prompt = `Analyze this reading data and provide intelligence insights:

Book Progress: ${progress}%
Highlights: ${highlights?.length || 0}
Notes: ${notes?.length || 0}
Time Spent: ${timeSpent || 'Unknown'}

Recent Highlights: ${highlights?.slice(-3).map(h => h.text.substring(0, 100)).join('; ') || 'None'}

Provide:
1. Reading pattern analysis
2. Engagement level assessment
3. Key themes being focused on
4. Suggestions for better retention
5. Recommended next actions`;

      const intelligence = await aiApi.generateChatResponse(prompt);
      
      return {
        success: true,
        data: {
          intelligence,
          metrics: {
            engagementScore: Math.min(100, (highlights?.length || 0) * 10 + (notes?.length || 0) * 15),
            retentionScore: Math.min(100, progress * 0.8 + (notes?.length || 0) * 5),
            applicationScore: Math.min(100, (notes?.length || 0) * 20)
          },
          analyzedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Reading intelligence error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Local storage management for books
  saveBook: async (bookData) => {
    try {
      const books = JSON.parse(localStorage.getItem('spark_ai_books') || '[]');
      const newBook = {
        ...bookData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      books.push(newBook);
      localStorage.setItem('spark_ai_books', JSON.stringify(books));
      
      return { success: true, data: newBook };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getBooks: async () => {
    try {
      const books = JSON.parse(localStorage.getItem('spark_ai_books') || '[]');
      return { success: true, data: books };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateBook: async (bookId, updates) => {
    try {
      const books = JSON.parse(localStorage.getItem('spark_ai_books') || '[]');
      const bookIndex = books.findIndex(b => b.id === bookId);
      
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }
      
      books[bookIndex] = {
        ...books[bookIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('spark_ai_books', JSON.stringify(books));
      
      return { success: true, data: books[bookIndex] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  deleteBook: async (bookId) => {
    try {
      const books = JSON.parse(localStorage.getItem('spark_ai_books') || '[]');
      const filteredBooks = books.filter(b => b.id !== bookId);
      
      localStorage.setItem('spark_ai_books', JSON.stringify(filteredBooks));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default smartBookshelfApi;