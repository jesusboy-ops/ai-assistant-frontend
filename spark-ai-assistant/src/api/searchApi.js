// Unified Search API - Search across all content types
import axiosInstance from './axios';
import { dictionaryApi } from './dictionaryApi';

export const searchApi = {
  // Unified search across all content types
  searchAll: async (query, options = {}) => {
    const {
      includeChats = true,
      includeNotes = true,
      includeTasks = true,
      includeDocuments = true,
      includeDictionary = true,
      includeReminders = true,
      limit = 50
    } = options;

    const results = {
      query,
      totalResults: 0,
      categories: {
        chats: { items: [], count: 0 },
        notes: { items: [], count: 0 },
        tasks: { items: [], count: 0 },
        documents: { items: [], count: 0 },
        dictionary: { items: [], count: 0 },
        reminders: { items: [], count: 0 }
      }
    };

    const searchPromises = [];

    // Search backend content (requires authentication)
    if (includeChats) {
      searchPromises.push(
        searchApi.searchChats(query, limit).then(data => {
          results.categories.chats = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.chats = { items: [], count: 0, error: 'Chat search unavailable' };
        })
      );
    }

    if (includeNotes) {
      searchPromises.push(
        searchApi.searchNotes(query, limit).then(data => {
          results.categories.notes = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.notes = { items: [], count: 0, error: 'Notes search unavailable' };
        })
      );
    }

    if (includeTasks) {
      searchPromises.push(
        searchApi.searchTasks(query, limit).then(data => {
          results.categories.tasks = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.tasks = { items: [], count: 0, error: 'Tasks search unavailable' };
        })
      );
    }

    if (includeDocuments) {
      searchPromises.push(
        searchApi.searchDocuments(query, limit).then(data => {
          results.categories.documents = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.documents = { items: [], count: 0, error: 'Documents search unavailable' };
        })
      );
    }

    if (includeReminders) {
      searchPromises.push(
        searchApi.searchReminders(query, limit).then(data => {
          results.categories.reminders = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.reminders = { items: [], count: 0, error: 'Reminders search unavailable' };
        })
      );
    }

    // Search local/frontend content
    if (includeDictionary) {
      searchPromises.push(
        searchApi.searchDictionaryHistory(query, limit).then(data => {
          results.categories.dictionary = data;
          results.totalResults += data.count;
        }).catch(() => {
          results.categories.dictionary = { items: [], count: 0, error: 'Dictionary search unavailable' };
        })
      );
    }

    // Wait for all searches to complete
    await Promise.allSettled(searchPromises);

    return {
      success: true,
      data: results
    };
  },

  // Search individual content types
  searchChats: async (query, limit = 20) => {
    try {
      const response = await axiosInstance.get('/api/search/chats', {
        params: { q: query, limit }
      });
      return {
        items: response.data.map(chat => ({
          id: chat.id,
          type: 'chat',
          title: chat.title || 'Chat Conversation',
          content: chat.messages?.[0]?.content || chat.content,
          snippet: searchApi.createSnippet(chat.messages?.[0]?.content || chat.content, query),
          date: chat.createdAt || chat.updatedAt,
          url: `/chat/${chat.id}`,
          metadata: {
            messageCount: chat.messages?.length || 0,
            lastMessage: chat.messages?.[chat.messages?.length - 1]?.content
          }
        })),
        count: response.data.length
      };
    } catch (error) {
      // Fallback: search local chat history if available
      const localChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const filtered = localChats.filter(chat => 
        chat.title?.toLowerCase().includes(query.toLowerCase()) ||
        chat.messages?.some(msg => msg.content?.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, limit);

      return {
        items: filtered.map(chat => ({
          id: chat.id,
          type: 'chat',
          title: chat.title || 'Chat Conversation',
          content: chat.messages?.[0]?.content || '',
          snippet: searchApi.createSnippet(chat.messages?.[0]?.content || '', query),
          date: chat.createdAt,
          url: `/chat/${chat.id}`,
          metadata: { messageCount: chat.messages?.length || 0 }
        })),
        count: filtered.length
      };
    }
  },

  searchNotes: async (query, limit = 20) => {
    try {
      const response = await axiosInstance.get('/api/search/notes', {
        params: { q: query, limit }
      });
      return {
        items: response.data.map(note => ({
          id: note.id,
          type: 'note',
          title: note.title,
          content: note.content,
          snippet: searchApi.createSnippet(note.content, query),
          date: note.updatedAt || note.createdAt,
          url: `/notes/${note.id}`,
          metadata: {
            tags: note.tags || [],
            wordCount: note.content?.split(' ').length || 0
          }
        })),
        count: response.data.length
      };
    } catch (error) {
      return { items: [], count: 0 };
    }
  },

  searchTasks: async (query, limit = 20) => {
    try {
      const response = await axiosInstance.get('/api/search/tasks', {
        params: { q: query, limit }
      });
      return {
        items: response.data.map(task => ({
          id: task.id,
          type: 'task',
          title: task.title,
          content: task.description,
          snippet: searchApi.createSnippet(task.description, query),
          date: task.dueDate || task.createdAt,
          url: `/tasks/${task.id}`,
          metadata: {
            priority: task.priority,
            completed: task.completed,
            dueDate: task.dueDate
          }
        })),
        count: response.data.length
      };
    } catch (error) {
      return { items: [], count: 0 };
    }
  },

  searchDocuments: async (query, limit = 20) => {
    try {
      const response = await axiosInstance.get('/api/search/documents', {
        params: { q: query, limit }
      });
      return {
        items: response.data.map(doc => ({
          id: doc.id,
          type: 'document',
          title: doc.title || doc.filename,
          content: doc.summary || doc.content,
          snippet: searchApi.createSnippet(doc.summary || doc.content, query),
          date: doc.createdAt,
          url: `/document-summarizer/${doc.id}`,
          metadata: {
            fileType: doc.fileType,
            fileSize: doc.fileSize,
            keyPoints: doc.keyPoints?.length || 0
          }
        })),
        count: response.data.length
      };
    } catch (error) {
      return { items: [], count: 0 };
    }
  },

  searchReminders: async (query, limit = 20) => {
    try {
      const response = await axiosInstance.get('/api/search/reminders', {
        params: { q: query, limit }
      });
      return {
        items: response.data.map(reminder => ({
          id: reminder.id,
          type: 'reminder',
          title: reminder.title,
          content: reminder.description,
          snippet: searchApi.createSnippet(reminder.description, query),
          date: reminder.reminderDate || reminder.reminder_time,
          url: `/reminders/${reminder.id}`,
          metadata: {
            type: reminder.type || reminder.repeat_type,
            completed: reminder.completed,
            reminderDate: reminder.reminderDate || reminder.reminder_time
          }
        })),
        count: response.data.length
      };
    } catch (error) {
      return { items: [], count: 0 };
    }
  },

  searchDictionaryHistory: async (query, limit = 20) => {
    try {
      // Search local dictionary history
      const history = JSON.parse(localStorage.getItem('dictionaryHistory') || '[]');
      const favorites = JSON.parse(localStorage.getItem('dictionaryFavorites') || '[]');
      
      const allWords = [...history, ...favorites].filter((word, index, self) => 
        self.findIndex(w => w.word === word.word) === index
      );

      const filtered = allWords.filter(entry => 
        entry.word?.toLowerCase().includes(query.toLowerCase()) ||
        entry.meanings?.some(meaning => 
          meaning.definitions?.some(def => 
            def.definition?.toLowerCase().includes(query.toLowerCase())
          )
        )
      ).slice(0, limit);

      return {
        items: filtered.map(entry => ({
          id: entry.word,
          type: 'dictionary',
          title: entry.word,
          content: entry.meanings?.[0]?.definitions?.[0]?.definition || '',
          snippet: searchApi.createSnippet(entry.meanings?.[0]?.definitions?.[0]?.definition || '', query),
          date: entry.searchedAt || new Date().toISOString(),
          url: `/dictionary?word=${entry.word}`,
          metadata: {
            phonetic: entry.phonetic,
            partOfSpeech: entry.meanings?.[0]?.partOfSpeech,
            isFavorite: favorites.some(fav => fav.word === entry.word)
          }
        })),
        count: filtered.length
      };
    } catch (error) {
      return { items: [], count: 0 };
    }
  },

  // Helper function to create search snippets
  createSnippet: (text, query, maxLength = 150) => {
    if (!text || !query) return text?.substring(0, maxLength) || '';
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) {
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    const snippet = text.substring(start, end);
    
    return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
  },

  // Get search suggestions
  getSearchSuggestions: async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await axiosInstance.get('/api/search/suggestions', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      // Fallback: generate suggestions from local data
      const suggestions = [];
      
      // Add common search terms
      const commonTerms = ['tasks', 'notes', 'reminders', 'documents', 'chats'];
      commonTerms.forEach(term => {
        if (term.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push({ text: term, type: 'category' });
        }
      });
      
      return suggestions.slice(0, 5);
    }
  }
};

export default searchApi;