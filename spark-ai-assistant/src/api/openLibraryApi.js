// Open Library API integration for Smart Bookshelf
import axios from 'axios';

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b';

export const openLibraryApi = {
  // Search for books by title, author, or subject
  searchBooks: async (query, options = {}) => {
    try {
      console.log('📚 Searching Open Library for:', query);
      
      const {
        limit = 20,
        offset = 0,
        fields = 'key,title,author_name,first_publish_year,isbn,cover_i,subject,publisher,language'
      } = options;
      
      const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, {
        params: {
          q: query,
          limit,
          offset,
          fields
        },
        timeout: 10000
      });
      
      const books = response.data.docs.map(book => ({
        id: book.key?.replace('/works/', '') || `book_${Date.now()}_${Math.random()}`,
        title: book.title || 'Unknown Title',
        author: book.author_name?.[0] || 'Unknown Author',
        authors: book.author_name || [],
        publishYear: book.first_publish_year || null,
        isbn: book.isbn?.[0] || null,
        coverId: book.cover_i || null,
        subjects: book.subject?.slice(0, 5) || [],
        publisher: book.publisher?.[0] || null,
        language: book.language?.[0] || 'en',
        openLibraryKey: book.key,
        source: 'open_library'
      }));
      
      console.log(`✅ Found ${books.length} books`);
      return {
        success: true,
        data: {
          books,
          total: response.data.numFound,
          offset: response.data.start
        }
      };
    } catch (error) {
      console.error('❌ Open Library search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get book details by Open Library key
  getBookDetails: async (bookKey) => {
    try {
      console.log('📖 Fetching book details for:', bookKey);
      
      const workKey = bookKey.startsWith('/works/') ? bookKey : `/works/${bookKey}`;
      
      const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}${workKey}.json`, {
        timeout: 8000
      });
      
      const book = response.data;
      
      // Get additional edition info if available
      let editionInfo = null;
      if (book.editions?.entries?.[0]) {
        try {
          const editionResponse = await axios.get(`${OPEN_LIBRARY_BASE_URL}${book.editions.entries[0]}.json`);
          editionInfo = editionResponse.data;
        } catch (editionError) {
          console.warn('Could not fetch edition info:', editionError);
        }
      }
      
      const bookDetails = {
        id: bookKey.replace('/works/', ''),
        title: book.title || 'Unknown Title',
        description: book.description?.value || book.description || 'No description available',
        authors: book.authors?.map(author => author.author?.key) || [],
        subjects: book.subjects || [],
        publishDate: editionInfo?.publish_date || null,
        pages: editionInfo?.number_of_pages || null,
        isbn: editionInfo?.isbn_13?.[0] || editionInfo?.isbn_10?.[0] || null,
        coverId: book.covers?.[0] || editionInfo?.covers?.[0] || null,
        openLibraryKey: workKey,
        source: 'open_library',
        rawData: book
      };
      
      console.log('✅ Book details fetched successfully');
      return {
        success: true,
        data: bookDetails
      };
    } catch (error) {
      console.error('❌ Book details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get cover image URL
  getCoverUrl: (coverId, size = 'M') => {
    if (!coverId) return null;
    
    // Sizes: S (small), M (medium), L (large)
    return `${COVERS_BASE_URL}/id/${coverId}-${size}.jpg`;
  },

  // Search books by category/subject
  searchBySubject: async (subject, options = {}) => {
    try {
      console.log('🏷️ Searching books by subject:', subject);
      
      const {
        limit = 20,
        offset = 0
      } = options;
      
      const response = await axios.get(`${OPEN_LIBRARY_BASE_URL}/subjects/${subject.toLowerCase().replace(/\s+/g, '_')}.json`, {
        params: {
          limit,
          offset
        },
        timeout: 10000
      });
      
      const books = response.data.works?.map(work => ({
        id: work.key?.replace('/works/', '') || `work_${Date.now()}_${Math.random()}`,
        title: work.title || 'Unknown Title',
        author: work.authors?.[0]?.name || 'Unknown Author',
        authors: work.authors?.map(a => a.name) || [],
        coverId: work.cover_id || null,
        openLibraryKey: work.key,
        subject: subject,
        source: 'open_library'
      })) || [];
      
      console.log(`✅ Found ${books.length} books in subject: ${subject}`);
      return {
        success: true,
        data: {
          books,
          subject,
          total: response.data.work_count
        }
      };
    } catch (error) {
      console.error('❌ Subject search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get curated book recommendations by category
  getCuratedRecommendations: async (category) => {
    const categoryMappings = {
      'productivity': ['productivity', 'time_management', 'self_help', 'business'],
      'career': ['career', 'leadership', 'management', 'entrepreneurship'],
      'communication': ['communication', 'writing', 'public_speaking', 'rhetoric'],
      'thinking': ['psychology', 'philosophy', 'critical_thinking', 'decision_making'],
      'technology': ['computer_science', 'artificial_intelligence', 'programming', 'technology']
    };
    
    const subjects = categoryMappings[category] || [category];
    const allBooks = [];
    
    try {
      console.log(`🎯 Getting curated recommendations for: ${category}`);
      
      // Search multiple subjects and combine results
      for (const subject of subjects.slice(0, 2)) { // Limit to 2 subjects to avoid too many requests
        const result = await this.searchBySubject(subject, { limit: 10 });
        if (result.success) {
          allBooks.push(...result.data.books);
        }
      }
      
      // Remove duplicates and sort by relevance
      const uniqueBooks = allBooks.filter((book, index, self) => 
        index === self.findIndex(b => b.id === book.id)
      ).slice(0, 12); // Limit to 12 recommendations
      
      console.log(`✅ Generated ${uniqueBooks.length} curated recommendations`);
      return {
        success: true,
        data: {
          books: uniqueBooks,
          category,
          subjects: subjects.slice(0, 2)
        }
      };
    } catch (error) {
      console.error('❌ Curated recommendations error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get trending/popular books (using high-rated subjects)
  getTrendingBooks: async (options = {}) => {
    const { limit = 20 } = options;
    
    const popularSubjects = [
      'bestsellers',
      'fiction',
      'business',
      'self_help',
      'biography',
      'science'
    ];
    
    try {
      console.log('🔥 Fetching trending books...');
      
      const randomSubject = popularSubjects[Math.floor(Math.random() * popularSubjects.length)];
      const result = await this.searchBySubject(randomSubject, { limit });
      
      if (result.success) {
        return {
          success: true,
          data: {
            books: result.data.books,
            category: 'trending',
            source: randomSubject
          }
        };
      }
      
      throw new Error('Failed to fetch trending books');
    } catch (error) {
      console.error('❌ Trending books error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Search for specific well-known productivity books
  getProductivityClassics: async () => {
    const classicBooks = [
      'Deep Work Cal Newport',
      'Atomic Habits James Clear',
      'Getting Things Done David Allen',
      'The 7 Habits Stephen Covey',
      'Thinking Fast and Slow Daniel Kahneman',
      'The Lean Startup Eric Ries',
      'Good to Great Jim Collins',
      'The Power of Habit Charles Duhigg'
    ];
    
    try {
      console.log('📚 Fetching productivity classics...');
      
      const bookPromises = classicBooks.slice(0, 6).map(query => 
        this.searchBooks(query, { limit: 1 })
      );
      
      const results = await Promise.all(bookPromises);
      const books = results
        .filter(result => result.success && result.data.books.length > 0)
        .map(result => result.data.books[0]);
      
      console.log(`✅ Found ${books.length} productivity classics`);
      return {
        success: true,
        data: {
          books,
          category: 'productivity_classics'
        }
      };
    } catch (error) {
      console.error('❌ Productivity classics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default openLibraryApi;