// Unified Search Component - Search across all content types
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Dialog,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Divider,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Note as NoteIcon,
  Task as TaskIcon,
  Description as DocumentIcon,
  Book as DictionaryIcon,
  NotificationsActive as ReminderIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../api/searchApi';
import { showToast } from '../utils/toast';

const UnifiedSearch = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);

  // Load search history on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Show last 5 searches
  }, []);

  // Focus search input when dialog opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [open]);

  // Get search suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length >= 2) {
        try {
          const suggestions = await searchApi.getSearchSuggestions(query);
          setSuggestions(suggestions);
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchApi.searchAll(searchQuery, {
        includeChats: true,
        includeNotes: true,
        includeTasks: true,
        includeDocuments: true,
        includeDictionary: true,
        includeReminders: true,
        limit: 20
      });

      if (searchResults.success) {
        setResults(searchResults.data);
        
        // Save to search history
        const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } else {
        showToast.error('Search failed');
      }
    } catch (error) {
      showToast.error('Search error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.url);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getTabIcon = (category) => {
    switch (category) {
      case 'chats': return <ChatIcon />;
      case 'notes': return <NoteIcon />;
      case 'tasks': return <TaskIcon />;
      case 'documents': return <DocumentIcon />;
      case 'dictionary': return <DictionaryIcon />;
      case 'reminders': return <ReminderIcon />;
      default: return <SearchIcon />;
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'chat': return <ChatIcon sx={{ color: '#06b6d4' }} />;
      case 'note': return <NoteIcon sx={{ color: '#10b981' }} />;
      case 'task': return <TaskIcon sx={{ color: '#f59e0b' }} />;
      case 'document': return <DocumentIcon sx={{ color: '#8b5cf6' }} />;
      case 'dictionary': return <DictionaryIcon sx={{ color: '#ef4444' }} />;
      case 'reminder': return <ReminderIcon sx={{ color: '#ec4899' }} />;
      default: return <SearchIcon />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderSearchResults = () => {
    if (!results) return null;

    const categories = Object.entries(results.categories).filter(([_, data]) => data.count > 0);
    
    if (categories.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            No results found
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Try different keywords or check your spelling
          </Typography>
        </Box>
      );
    }

    const allResults = categories.flatMap(([category, data]) => 
      data.items.map(item => ({ ...item, category }))
    );

    // Show results by category or all results
    const displayResults = selectedTab === 0 
      ? allResults 
      : categories[selectedTab - 1]?.[1]?.items || [];

    return (
      <List>
        {displayResults.map((result, index) => (
          <ListItem key={`${result.type}-${result.id}-${index}`} disablePadding>
            <ListItemButton onClick={() => handleResultClick(result)}>
              <ListItemIcon>
                {getResultIcon(result.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: 'white' }}>
                      {result.title}
                    </Typography>
                    <Chip 
                      label={result.type} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {result.snippet || result.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        {formatDate(result.date)}
                      </Typography>
                      {result.metadata && Object.entries(result.metadata).slice(0, 2).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.6rem',
                            height: 20
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  const renderSearchHistory = () => {
    if (searchHistory.length === 0) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon fontSize="small" />
          Recent Searches
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {searchHistory.map((historyQuery, index) => (
            <Chip
              key={index}
              label={historyQuery}
              size="small"
              onClick={() => {
                setQuery(historyQuery);
                handleSearch(historyQuery);
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingIcon fontSize="small" />
          Suggestions
        </Typography>
        <List dense>
          {suggestions.map((suggestion, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => {
                setQuery(suggestion.text);
                handleSearch(suggestion.text);
              }}>
                <ListItemText
                  primary={suggestion.text}
                  secondary={suggestion.type}
                  sx={{
                    '& .MuiListItemText-primary': { color: 'rgba(255, 255, 255, 0.9)' },
                    '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(17, 24, 39, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <TextField
            ref={searchInputRef}
            fullWidth
            placeholder="Search across chats, notes, tasks, documents, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading && <CircularProgress size={20} />}
                  <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#06b6d4'
                }
              }
            }}
          />
        </Box>

        {/* Results Tabs */}
        {results && (
          <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-selected': {
                    color: '#06b6d4'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#06b6d4'
                }
              }}
            >
              <Tab 
                label={
                  <Badge badgeContent={results.totalResults} color="primary">
                    All Results
                  </Badge>
                } 
              />
              {Object.entries(results.categories).map(([category, data]) => (
                data.count > 0 && (
                  <Tab
                    key={category}
                    icon={getTabIcon(category)}
                    label={
                      <Badge badgeContent={data.count} color="primary">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Badge>
                    }
                    iconPosition="start"
                  />
                )
              ))}
            </Tabs>
          </Box>
        )}

        {/* Content */}
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {!query && !results && (
            <>
              {renderSearchHistory()}
              {searchHistory.length > 0 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
            </>
          )}
          
          {query && !results && suggestions.length > 0 && renderSuggestions()}
          
          {results && renderSearchResults()}
        </Box>

        {/* Footer */}
        {results && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Found {results.totalResults} results for "{results.query}"
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedSearch;