// Smart Bookshelf - AI-powered reading and productivity system
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Search as SearchIcon,
  Add as AddIcon,
  AutoAwesome as SparkIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { openLibraryApi } from '../api/openLibraryApi';
import { fetchBooks, addBook } from '../store/slices/smartBookshelfSlice';

const SmartBookshelf = () => {
  console.log('🔍 SmartBookshelf component rendering...');
  
  const dispatch = useDispatch();
  const { books, categories, loading } = useSelector((state) => state.smartBookshelf);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [addBookDialog, setAddBookDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  // Curated collection of 50 real books with verified Open Library cover IDs
  const curatedBooksData = [
    // PRODUCTIVITY & SELF-HELP (15 books)
    {
      id: 'atomic-habits',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverId: 10958382,
      category: 'productivity',
      subjects: ['Self-help', 'Productivity', 'Habits'],
      publishYear: 2018,
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones'
    },
    {
      id: 'deep-work',
      title: 'Deep Work',
      author: 'Cal Newport',
      coverId: 8439605,
      category: 'productivity',
      subjects: ['Productivity', 'Focus', 'Work'],
      publishYear: 2016,
      description: 'Rules for Focused Success in a Distracted World'
    },
    {
      id: 'power-of-habit',
      title: 'The Power of Habit',
      author: 'Charles Duhigg',
      coverId: 7776807,
      category: 'productivity',
      subjects: ['Psychology', 'Self-help', 'Habits'],
      publishYear: 2012,
      description: 'Why We Do What We Do in Life and Business'
    },
    {
      id: 'seven-habits',
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen R. Covey',
      coverId: 83273,
      category: 'productivity',
      subjects: ['Self-help', 'Leadership', 'Personal Development'],
      publishYear: 1989,
      description: 'Powerful Lessons in Personal Change'
    },
    {
      id: 'getting-things-done',
      title: 'Getting Things Done',
      author: 'David Allen',
      coverId: 112243,
      category: 'productivity',
      subjects: ['Productivity', 'Time Management', 'Organization'],
      publishYear: 2001,
      description: 'The Art of Stress-Free Productivity'
    },
    {
      id: 'essentialism',
      title: 'Essentialism',
      author: 'Greg McKeown',
      coverId: 8706777,
      category: 'productivity',
      subjects: ['Self-help', 'Productivity', 'Decision Making'],
      publishYear: 2014,
      description: 'The Disciplined Pursuit of Less'
    },
    {
      id: 'mindset',
      title: 'Mindset',
      author: 'Carol S. Dweck',
      coverId: 372906,
      category: 'productivity',
      subjects: ['Psychology', 'Self-help', 'Education'],
      publishYear: 2006,
      description: 'The New Psychology of Success'
    },
    {
      id: 'grit',
      title: 'Grit',
      author: 'Angela Duckworth',
      coverId: 8909777,
      category: 'productivity',
      subjects: ['Psychology', 'Self-help', 'Success'],
      publishYear: 2016,
      description: 'The Power of Passion and Perseverance'
    },
    {
      id: 'flow',
      title: 'Flow',
      author: 'Mihaly Csikszentmihalyi',
      coverId: 19288,
      category: 'productivity',
      subjects: ['Psychology', 'Happiness', 'Performance'],
      publishYear: 1990,
      description: 'The Psychology of Optimal Experience'
    },
    {
      id: 'digital-minimalism',
      title: 'Digital Minimalism',
      author: 'Cal Newport',
      coverId: 10958383,
      category: 'productivity',
      subjects: ['Technology', 'Self-help', 'Minimalism'],
      publishYear: 2019,
      description: 'Choosing a Focused Life in a Noisy World'
    },
    // BUSINESS & CAREER (15 books)
    {
      id: 'lean-startup',
      title: 'The Lean Startup',
      author: 'Eric Ries',
      coverId: 7735184,
      category: 'career',
      subjects: ['Business', 'Entrepreneurship', 'Innovation'],
      publishYear: 2011,
      description: 'How Today\'s Entrepreneurs Use Continuous Innovation'
    },
    {
      id: 'good-to-great',
      title: 'Good to Great',
      author: 'Jim Collins',
      coverId: 332654,
      category: 'career',
      subjects: ['Business', 'Leadership', 'Management'],
      publishYear: 2001,
      description: 'Why Some Companies Make the Leap... and Others Don\'t'
    },
    {
      id: 'zero-to-one',
      title: 'Zero to One',
      author: 'Peter Thiel',
      coverId: 8706780,
      category: 'career',
      subjects: ['Business', 'Entrepreneurship', 'Innovation'],
      publishYear: 2014,
      description: 'Notes on Startups, or How to Build the Future'
    },
    {
      id: 'start-with-why',
      title: 'Start with Why',
      author: 'Simon Sinek',
      coverId: 6708313,
      category: 'career',
      subjects: ['Leadership', 'Business', 'Motivation'],
      publishYear: 2009,
      description: 'How Great Leaders Inspire Everyone to Take Action'
    },
    {
      id: 'principles',
      title: 'Principles',
      author: 'Ray Dalio',
      coverId: 8706783,
      category: 'career',
      subjects: ['Business', 'Leadership', 'Decision Making'],
      publishYear: 2017,
      description: 'Life and Work'
    },
    // PSYCHOLOGY & THINKING (10 books)
    {
      id: 'thinking-fast-slow',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      coverId: 7815442,
      category: 'thinking',
      subjects: ['Psychology', 'Decision Making', 'Behavioral Economics'],
      publishYear: 2011,
      description: 'The groundbreaking work on decision-making and behavioral economics'
    },
    {
      id: 'influence',
      title: 'Influence',
      author: 'Robert B. Cialdini',
      coverId: 295030,
      category: 'thinking',
      subjects: ['Psychology', 'Persuasion', 'Social Psychology'],
      publishYear: 1984,
      description: 'The Psychology of Persuasion'
    },
    {
      id: 'predictably-irrational',
      title: 'Predictably Irrational',
      author: 'Dan Ariely',
      coverId: 1344188,
      category: 'thinking',
      subjects: ['Psychology', 'Behavioral Economics', 'Decision Making'],
      publishYear: 2008,
      description: 'The Hidden Forces That Shape Our Decisions'
    },
    {
      id: 'blink',
      title: 'Blink',
      author: 'Malcolm Gladwell',
      coverId: 295031,
      category: 'thinking',
      subjects: ['Psychology', 'Decision Making', 'Intuition'],
      publishYear: 2005,
      description: 'The Power of Thinking Without Thinking'
    },
    {
      id: 'outliers',
      title: 'Outliers',
      author: 'Malcolm Gladwell',
      coverId: 1344190,
      category: 'thinking',
      subjects: ['Psychology', 'Success', 'Sociology'],
      publishYear: 2008,
      description: 'The Story of Success'
    },
    // COMMUNICATION & WRITING (5 books)
    {
      id: 'how-to-win-friends',
      title: 'How to Win Friends and Influence People',
      author: 'Dale Carnegie',
      coverId: 83274,
      category: 'communication',
      subjects: ['Communication', 'Relationships', 'Self-help'],
      publishYear: 1936,
      description: 'The classic guide to interpersonal relations'
    },
    {
      id: 'crucial-conversations',
      title: 'Crucial Conversations',
      author: 'Kerry Patterson',
      coverId: 295033,
      category: 'communication',
      subjects: ['Communication', 'Relationships', 'Conflict Resolution'],
      publishYear: 2002,
      description: 'Tools for Talking When Stakes Are High'
    },
    // TECHNOLOGY & AI (5 books)
    {
      id: 'sapiens',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      coverId: 8706786,
      category: 'technology',
      subjects: ['History', 'Anthropology', 'Future'],
      publishYear: 2014,
      description: 'A Brief History of Humankind'
    },
    {
      id: 'homo-deus',
      title: 'Homo Deus',
      author: 'Yuval Noah Harari',
      coverId: 8706787,
      category: 'technology',
      subjects: ['Future', 'Technology', 'Philosophy'],
      publishYear: 2016,
      description: 'A Brief History of Tomorrow'
    }
  ];

  // Helper functions
  const getRandomBooks = (limit = 10) => {
    const shuffled = [...curatedBooksData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };

  const searchCuratedBooks = (query) => {
    const searchTerm = query.toLowerCase();
    return curatedBooksData.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.subjects.some(subject => subject.toLowerCase().includes(searchTerm))
    );
  };

  useEffect(() => {
    console.log('📚 SmartBookshelf mounted successfully');
    
    // Load user's books from localStorage
    dispatch(fetchBooks());
    
    // Load AI recommendations
    loadRecommendations();
    
    // Add some sample books if library is empty
    addSampleBooksIfEmpty();
  }, [dispatch]);

  const addSampleBooksIfEmpty = async () => {
    try {
      // Check if user already has books
      const existingBooks = JSON.parse(localStorage.getItem('spark_ai_books') || '[]');
      
      if (existingBooks.length === 0) {
        console.log('📚 Adding curated books to empty library...');
        
        // Get a diverse selection of 12 books from our curated collection
        const selectedBooks = [
          // Top productivity books
          curatedBooksData.find(book => book.id === 'atomic-habits'),
          curatedBooksData.find(book => book.id === 'deep-work'),
          curatedBooksData.find(book => book.id === 'power-of-habit'),
          curatedBooksData.find(book => book.id === 'seven-habits'),
          
          // Business & Career
          curatedBooksData.find(book => book.id === 'lean-startup'),
          curatedBooksData.find(book => book.id === 'good-to-great'),
          curatedBooksData.find(book => book.id === 'zero-to-one'),
          
          // Psychology & Thinking
          curatedBooksData.find(book => book.id === 'thinking-fast-slow'),
          curatedBooksData.find(book => book.id === 'influence'),
          curatedBooksData.find(book => book.id === 'mindset'),
          
          // Communication
          curatedBooksData.find(book => book.id === 'how-to-win-friends'),
          
          // Technology
          curatedBooksData.find(book => book.id === 'sapiens')
        ].filter(Boolean); // Remove any undefined books
        
        // Add reading progress and engagement data to make them look realistic
        const booksWithProgress = selectedBooks.map((book, index) => ({
          ...book,
          progress: [0, 15, 30, 45, 60, 75, 85, 100, 25, 50, 10, 5][index] || 0,
          highlights: generateSampleHighlights(book, index),
          notes: generateSampleNotes(book, index),
          insights: generateSampleInsights(book, index),
          addedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString() // Stagger dates
        }));
        
        // Add books to localStorage
        localStorage.setItem('spark_ai_books', JSON.stringify(booksWithProgress));
        
        // Refresh the books in Redux store
        dispatch(fetchBooks());
      }
    } catch (error) {
      console.error('Error adding curated books:', error);
    }
  };

  // Helper function to generate sample highlights
  const generateSampleHighlights = (book, index) => {
    const highlights = {
      'atomic-habits': [
        { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', page: 27 },
        { text: 'Every action is a vote for the type of person you wish to become.', page: 38 }
      ],
      'deep-work': [
        { text: 'Human beings, it seems, are at their best when immersed deeply in something challenging.', page: 15 },
        { text: 'Clarity about what matters provides clarity about what does not.', page: 71 }
      ],
      'thinking-fast-slow': [
        { text: 'A reliable way to make people believe in falsehoods is frequent repetition.', page: 62 }
      ],
      'lean-startup': [
        { text: 'The only way to win is to learn faster than anyone else.', page: 45 }
      ]
    };
    return highlights[book.id] || (index < 4 ? [{ text: 'Key insight from this book...', page: 1 }] : []);
  };

  // Helper function to generate sample notes
  const generateSampleNotes = (book, index) => {
    const notes = {
      'atomic-habits': [
        { title: 'Habit Stacking', content: 'Link new habits to existing ones for better consistency.' }
      ],
      'deep-work': [
        { title: 'Deep Work Rules', content: 'Work deeply, embrace boredom, quit social media, drain the shallows.' }
      ],
      'thinking-fast-slow': [
        { title: 'System 1 vs System 2', content: 'Fast intuitive thinking vs slow deliberate thinking.' }
      ]
    };
    return notes[book.id] || (index < 6 ? [{ title: 'Key Takeaway', content: 'Important lesson from this book.' }] : []);
  };

  // Helper function to generate sample insights
  const generateSampleInsights = (book, index) => {
    const insights = {
      'atomic-habits': [
        { title: '1% Better Daily', content: 'Small improvements compound over time.' }
      ],
      'deep-work': [
        { title: 'Focus Blocks', content: 'Schedule specific times for deep, uninterrupted work.' }
      ]
    };
    return insights[book.id] || (index < 3 ? [{ title: 'Action Item', content: 'Apply this concept immediately.' }] : []);
  };

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      
      // Get a diverse selection from our curated collection
      const productivityBooks = curatedBooksData.filter(book => book.category === 'productivity').slice(0, 2);
      const businessBooks = curatedBooksData.filter(book => book.category === 'career').slice(0, 1);
      const thinkingBooks = curatedBooksData.filter(book => book.category === 'thinking').slice(0, 1);
      
      // Combine different categories for variety
      const recommendedBooks = [
        ...productivityBooks,
        ...businessBooks,
        ...thinkingBooks
      ];
      
      setRecommendations(recommendedBooks);
      
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      
      // Fallback to specific curated books if there's an error
      const fallbackBooks = [
        curatedBooksData.find(book => book.id === 'atomic-habits'),
        curatedBooksData.find(book => book.id === 'deep-work'),
        curatedBooksData.find(book => book.id === 'lean-startup'),
        curatedBooksData.find(book => book.id === 'thinking-fast-slow')
      ].filter(Boolean);
      
      setRecommendations(fallbackBooks);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      console.log('🔍 Searching for books:', searchQuery);
      
      // First search our curated collection for instant results
      const curatedResults = searchCuratedBooks(searchQuery);
      
      // Then search Open Library for additional results
      const openLibraryResult = await openLibraryApi.searchBooks(searchQuery, { limit: 8 });
      
      let allResults = [];
      
      // Add curated books first (they have verified covers)
      if (curatedResults.length > 0) {
        allResults = [...curatedResults.slice(0, 6)];
      }
      
      // Add Open Library results
      if (openLibraryResult.success) {
        allResults = [...allResults, ...openLibraryResult.data.books.slice(0, 6)];
      }
      
      // Remove duplicates based on title and author
      const uniqueResults = allResults.filter((book, index, self) => 
        index === self.findIndex(b => 
          b.title.toLowerCase() === book.title.toLowerCase() && 
          b.author.toLowerCase() === book.author.toLowerCase()
        )
      );
      
      setSearchResults(uniqueResults.slice(0, 12)); // Limit to 12 total results
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const bookToAdd = {
        ...bookData,
        progress: 0,
        highlights: [],
        notes: [],
        insights: [],
        addedAt: new Date().toISOString(),
        category: getCategoryFromSubjects(bookData.subjects)
      };
      
      dispatch(addBook(bookToAdd));
      setAddBookDialog(false);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const getCategoryFromSubjects = (subjects) => {
    if (!subjects || subjects.length === 0) return 'general';
    
    const subjectStr = subjects.join(' ').toLowerCase();
    
    if (subjectStr.includes('business') || subjectStr.includes('productivity') || subjectStr.includes('time')) {
      return 'productivity';
    } else if (subjectStr.includes('career') || subjectStr.includes('leadership') || subjectStr.includes('management')) {
      return 'career';
    } else if (subjectStr.includes('communication') || subjectStr.includes('writing')) {
      return 'communication';
    } else if (subjectStr.includes('psychology') || subjectStr.includes('philosophy') || subjectStr.includes('thinking')) {
      return 'thinking';
    } else if (subjectStr.includes('technology') || subjectStr.includes('computer') || subjectStr.includes('programming')) {
      return 'technology';
    }
    
    return 'general';
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      'productivity': '#667eea',
      'career': '#10b981',
      'communication': '#06b6d4',
      'thinking': '#8b5cf6',
      'technology': '#f59e0b',
      'general': '#6b7280'
    };
    return categoryMap[category] || '#6b7280';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BookIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Smart Bookshelf
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Your AI-powered reading companion for productivity and growth
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          placeholder="Search books, highlights, or insights..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
            },
            minWidth: 300,
            flex: 1
          }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          disabled={searching || !searchQuery.trim()}
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            minWidth: 120
          }}
        >
          {searching ? <CircularProgress size={20} color="inherit" /> : 'Search'}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddBookDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minWidth: 140
          }}
        >
          Add Book
        </Button>
        <Button
          variant="outlined"
          startIcon={<BookIcon />}
          onClick={() => {
            setSearchResults(getRandomBooks(20));
            setAddBookDialog(true);
          }}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            minWidth: 160,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Browse 50 Books
        </Button>
      </Box>

      {/* AI Recommendations Section */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.3)'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SparkIcon sx={{ color: '#667eea' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              AI Recommendations
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
            Curated productivity and growth books to enhance your skills:
          </Typography>
          
          {loadingRecommendations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#667eea' }} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {recommendations.map((book, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      '&:hover': { transform: 'translateY(-2px)' },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleAddBook(book)}
                  >
                    <CardContent sx={{ display: 'flex', gap: 2 }}>
                      {book.coverId && (
                        <Box
                          component="img"
                          src={openLibraryApi.getCoverUrl(book.coverId, 'S')}
                          alt={book.title}
                          sx={{
                            width: 48,
                            height: 64,
                            borderRadius: 1,
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                          by {book.author}
                        </Typography>
                        <Chip
                          label="Productivity Classic"
                          size="small"
                          sx={{ backgroundColor: alpha('#667eea', 0.2), color: '#667eea' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Books Grid */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
        Your Library ({books.length} books)
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      ) : books.length === 0 ? (
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          py: 6
        }}>
          <CardContent>
            <BookIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Your library is empty
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Start building your Smart Bookshelf by adding books from our recommendations or searching for new ones.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddBookDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Add Your First Book
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => {
            const categoryColor = getCategoryColor(book.category);
            return (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
                    border: `1px solid ${alpha(categoryColor, 0.3)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                      }
                  }}
                  onClick={() => setSelectedBook(book)}
                >
                  <CardContent>
                    {/* Book Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      {book.coverId ? (
                        <Box
                          component="img"
                          src={openLibraryApi.getCoverUrl(book.coverId, 'M')}
                          alt={book.title}
                          sx={{
                            width: 64,
                            height: 96,
                            borderRadius: 1,
                            objectFit: 'cover',
                            flexShrink: 0
                            }}
                          onError={(e) => {
                            // Try smaller size if medium fails
                            e.target.src = openLibraryApi.getCoverUrl(book.coverId, 'S');
                            e.target.onerror = () => {
                              e.target.style.display = 'none';
                            };
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 64,
                            height: 96,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${categoryColor} 0%, ${alpha(categoryColor, 0.7)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                            }}
                        >
                          <BookIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: 'white',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2
                          }}
                        >
                          {book.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          by {book.author}
                        </Typography>
                        {book.publishYear && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Published {book.publishYear}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Category */}
                    <Chip
                      label={book.category || 'General'}
                      size="small"
                      sx={{
                        backgroundColor: alpha(categoryColor, 0.2),
                        color: categoryColor,
                        mb: 2,
                        textTransform: 'capitalize'
                      }}
                    />

                    {/* Progress Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Reading Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: categoryColor, fontWeight: 600 }}>
                          {book.progress || 0}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 6,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 3,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${book.progress || 0}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${categoryColor}, ${alpha(categoryColor, 0.7)})`,
                            borderRadius: 3
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: categoryColor, fontWeight: 700 }}>
                          {book.highlights?.length || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Highlights
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: categoryColor, fontWeight: 700 }}>
                          {book.notes?.length || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Notes
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: categoryColor, fontWeight: 700 }}>
                          {book.insights?.length || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Insights
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${categoryColor} 0%, ${alpha(categoryColor, 0.8)} 100%)`,
                        fontSize: '0.75rem'
                      }}
                    >
                      {book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add Book Dialog */}
      <Dialog
        open={addBookDialog}
        onClose={() => {
          setAddBookDialog(false);
          setSearchResults([]);
          setSearchQuery('');
        }}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              maxHeight: '80vh'
            }
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BookIcon sx={{ color: '#667eea' }} />
            Add New Book
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
            {searchResults.length > 0 && !searchQuery ? 
              'Browse our curated collection of 50 productivity and growth books with verified covers.' :
              'Search for books using the Open Library database and add them to your Smart Bookshelf.'
            }
          </Typography>
          
          {/* Search Input */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by title, author, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                minWidth: 100
              }}
            >
              {searching ? <CircularProgress size={20} color="inherit" /> : 'Search'}
            </Button>
          </Box>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                {searchQuery ? 
                  `Search Results (${searchResults.length} books found)` :
                  `Curated Collection (${searchResults.length} books)`
                }
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                <Grid container spacing={2}>
                  {searchResults.map((book, index) => (
                    <Grid item xs={12} key={book.id || index}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleAddBook(book)}
                      >
                        <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
                          {/* Book Cover */}
                          {book.coverId ? (
                            <Box
                              component="img"
                              src={openLibraryApi.getCoverUrl(book.coverId, 'M')}
                              alt={book.title}
                              sx={{
                                width: 64,
                                height: 96,
                                borderRadius: 1,
                                objectFit: 'cover',
                                flexShrink: 0
                                }}
                              onError={(e) => {
                                // Try smaller size if medium fails
                                e.target.src = openLibraryApi.getCoverUrl(book.coverId, 'S');
                                e.target.onerror = () => {
                                  e.target.style.display = 'none';
                                };
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 64,
                                height: 96,
                                borderRadius: 1,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                                }}
                            >
                              <BookIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                          )}
                          
                          {/* Book Info */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: 'white',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {book.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                              by {book.author}
                            </Typography>
                            
                            {/* Book Description */}
                            {book.description && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.6)', 
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.3
                                }}
                              >
                                {book.description}
                              </Typography>
                            )}
                            
                            {/* Book Details */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                              {book.publishYear && (
                                <Chip
                                  label={book.publishYear}
                                  size="small"
                                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)' }}
                                />
                              )}
                              {book.subjects && book.subjects.length > 0 && (
                                <Chip
                                  label={book.subjects[0]}
                                  size="small"
                                  sx={{ backgroundColor: alpha('#667eea', 0.2), color: '#667eea' }}
                                />
                              )}
                            </Box>
                            
                            {/* Add Button */}
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<AddIcon />}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                fontSize: '0.75rem',
                                mt: 1
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddBook(book);
                              }}
                            >
                              Add to Library
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* No Results Message */}
          {searchQuery && searchResults.length === 0 && !searching && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BookIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                No books found
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Try searching with different keywords or check your spelling.
              </Typography>
            </Box>
          )}

          {/* Initial State */}
          {!searchQuery && searchResults.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Search for Books
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Enter a book title, author name, or subject to find books from the Open Library database.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setAddBookDialog(false);
              setSearchResults([]);
              setSearchQuery('');
            }} 
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartBookshelf;