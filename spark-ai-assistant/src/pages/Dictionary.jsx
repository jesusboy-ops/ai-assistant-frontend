// Dictionary page - Standalone Dictionary Module
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search as SearchIcon,
  VolumeUp as VolumeUpIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as ContentCopyIcon,
  NoteAdd as NoteAddIcon,
  History as HistoryIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { searchWord, addToFavorites, removeFromFavorites, clearHistory, clearFavorites } from '../store/slices/dictionarySlice';
import { createNote } from '../store/slices/notesSlice';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Dictionary = () => {
  const dispatch = useDispatch();
  const {
    currentWord,
    currentDefinition,
    searchHistory,
    favorites,
    loading,
    error
  } = useSelector((state) => state.dictionary);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleSearch = async (word = searchTerm) => {
    if (!word.trim()) return;
    
    try {
      await dispatch(searchWord(word.trim())).unwrap();
      setSearchTerm(word.trim());
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playPronunciation = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        showToast.error('Audio playback failed');
      });
    }
  };

  const handleFavorite = () => {
    if (!currentWord || !currentDefinition) return;

    const isFavorited = favorites.some(fav => fav.word === currentWord);
    
    if (isFavorited) {
      dispatch(removeFromFavorites(currentWord));
      showToast.success('Removed from favorites');
    } else {
      dispatch(addToFavorites({ word: currentWord, definition: currentDefinition }));
      showToast.success('Added to favorites');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy');
    });
  };

  const saveToNotes = async () => {
    if (!currentWord || !currentDefinition) return;

    const noteContent = formatDefinitionForNotes(currentWord, currentDefinition);
    
    try {
      await dispatch(createNote({
        title: `Dictionary: ${currentWord}`,
        content: noteContent,
        tags: ['dictionary', 'vocabulary']
      })).unwrap();
      showToast.success('Saved to notes');
    } catch (error) {
      showToast.error('Failed to save to notes');
    }
  };

  const formatDefinitionForNotes = (word, definition) => {
    let content = `# ${word}\n\n`;
    
    if (definition.phonetic) {
      content += `**Pronunciation:** ${definition.phonetic}\n\n`;
    }

    definition.meanings?.forEach((meaning, index) => {
      content += `## ${meaning.partOfSpeech}\n\n`;
      
      meaning.definitions?.forEach((def, defIndex) => {
        content += `${defIndex + 1}. ${def.definition}\n`;
        if (def.example) {
          content += `   *Example: ${def.example}*\n`;
        }
        content += '\n';
      });

      if (meaning.synonyms?.length > 0) {
        content += `**Synonyms:** ${meaning.synonyms.join(', ')}\n\n`;
      }

      if (meaning.antonyms?.length > 0) {
        content += `**Antonyms:** ${meaning.antonyms.join(', ')}\n\n`;
      }
    });

    return content;
  };

  const renderDefinition = () => {
    if (!currentDefinition) return null;

    const audioUrl = currentDefinition.phonetics?.find(p => p.audio)?.audio;
    const phoneticText = currentDefinition.phonetic || 
                        currentDefinition.phonetics?.find(p => p.text)?.text;

    return (
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                {currentWord}
              </Typography>
              {phoneticText && (
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {phoneticText}
                </Typography>
              )}
              {audioUrl && (
                <IconButton onClick={() => playPronunciation(audioUrl)} sx={{ color: '#06b6d4' }}>
                  <VolumeUpIcon />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Add to favorites">
                <IconButton onClick={handleFavorite} sx={{ color: '#06b6d4' }}>
                  {favorites.some(fav => fav.word === currentWord) ? 
                    <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy definition">
                <IconButton 
                  onClick={() => copyToClipboard(formatDefinitionForNotes(currentWord, currentDefinition))}
                  sx={{ color: '#06b6d4' }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save to notes">
                <IconButton onClick={saveToNotes} sx={{ color: '#06b6d4' }}>
                  <NoteAddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {currentDefinition.meanings?.map((meaning, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#667eea', mb: 1, fontWeight: 600 }}>
                {meaning.partOfSpeech}
              </Typography>
              
              {meaning.definitions?.map((def, defIndex) => (
                <Box key={defIndex} sx={{ mb: 2, pl: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {defIndex + 1}. {def.definition}
                  </Typography>
                  {def.example && (
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: 'rgba(255, 255, 255, 0.7)',
                      pl: 2 
                    }}>
                      Example: "{def.example}"
                    </Typography>
                  )}
                </Box>
              ))}

              {(meaning.synonyms?.length > 0 || meaning.antonyms?.length > 0) && (
                <Box sx={{ mt: 2 }}>
                  {meaning.synonyms?.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#06b6d4', mb: 1 }}>
                        Synonyms:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {meaning.synonyms.map((synonym, synIndex) => (
                          <Chip
                            key={synIndex}
                            label={synonym}
                            size="small"
                            onClick={() => handleSearch(synonym)}
                            sx={{
                              backgroundColor: 'rgba(6, 182, 212, 0.2)',
                              color: '#06b6d4',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(6, 182, 212, 0.3)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {meaning.antonyms?.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#f59e0b', mb: 1 }}>
                        Antonyms:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {meaning.antonyms.map((antonym, antIndex) => (
                          <Chip
                            key={antIndex}
                            label={antonym}
                            size="small"
                            onClick={() => handleSearch(antonym)}
                            sx={{
                              backgroundColor: 'rgba(245, 158, 11, 0.2)',
                              color: '#f59e0b',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(245, 158, 11, 0.3)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderHistory = () => (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#06b6d4' }}>
            Search History
          </Typography>
          {searchHistory.length > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={() => dispatch(clearHistory())}
              size="small"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear
            </Button>
          )}
        </Box>
        
        {searchHistory.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No search history yet
          </Typography>
        ) : (
          <List>
            {searchHistory.slice(0, 20).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSearch(item.word)}>
                  <ListItemText
                    primary={item.word}
                    secondary={new Date(item.searchedAt).toLocaleDateString()}
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderFavorites = () => (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#06b6d4' }}>
            Favorite Words
          </Typography>
          {favorites.length > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={() => dispatch(clearFavorites())}
              size="small"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Clear
            </Button>
          )}
        </Box>
        
        {favorites.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No favorite words yet
          </Typography>
        ) : (
          <List>
            {favorites.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleSearch(item.word)}>
                  <ListItemText
                    primary={item.word}
                    secondary={new Date(item.addedAt).toLocaleDateString()}
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.5)' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Dictionary"
        subtitle="Look up definitions, pronunciations, and examples for any English word"
        icon={<SearchIcon />}
      />

      {/* Search Section */}
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Enter a word to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#06b6d4' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleSearch()}
              disabled={loading || !searchTerm.trim()}
              startIcon={loading ? <LoadingSpinner size={16} type="modern" color="white" /> : <SearchIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minWidth: 120
              }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Definition Section */}
        <Box sx={{ flex: 2 }}>
          {renderDefinition()}
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 2,
              '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .Mui-selected': { color: '#06b6d4' },
              '& .MuiTabs-indicator': { backgroundColor: '#06b6d4' }
            }}
          >
            <Tab icon={<HistoryIcon />} label="History" />
            <Tab icon={<FavoriteIcon />} label="Favorites" />
          </Tabs>

          {activeTab === 0 && renderHistory()}
          {activeTab === 1 && renderFavorites()}
        </Box>
      </Box>
    </Container>
  );
};

export default Dictionary;