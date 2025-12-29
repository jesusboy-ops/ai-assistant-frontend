// Translator page - Language Translator
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Translate as TranslateIcon,
  SwapHoriz as SwapHorizIcon,
  ContentCopy as ContentCopyIcon,
  VolumeUp as VolumeUpIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Psychology as AutoDetectIcon
} from '@mui/icons-material';
import {
  fetchLanguages,
  translateText,
  detectLanguage,
  setSourceLang,
  setTargetLang,
  setOriginalText,
  clearTranslation,
  swapLanguages,
  clearHistory
} from '../store/slices/translatorSlice';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Translator = () => {
  const dispatch = useDispatch();
  const {
    languages,
    sourceLang,
    targetLang,
    originalText,
    translatedText,
    translationHistory,
    loading,
    error,
    detectedLanguage
  } = useSelector((state) => state.translator);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const handleTranslate = async () => {
    if (!originalText.trim()) {
      showToast.error('Please enter text to translate');
      return;
    }

    let sourceLanguage = sourceLang;
    
    // Auto-detect language if needed
    if (sourceLang === 'auto') {
      try {
        const detection = await dispatch(detectLanguage(originalText)).unwrap();
        if (detection && detection.length > 0) {
          sourceLanguage = detection[0].language;
        } else {
          sourceLanguage = 'en'; // Fallback to English
        }
      } catch (error) {
        sourceLanguage = 'en'; // Fallback to English
      }
    }

    try {
      await dispatch(translateText({
        text: originalText,
        sourceLang: sourceLanguage,
        targetLang
      })).unwrap();
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Translation failed';
      showToast.error(errorMessage);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      dispatch(swapLanguages());
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy');
    });
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      showToast.error('Speech synthesis not supported');
    }
  };

  const getLanguageName = (code) => {
    if (code === 'auto') return 'Auto-detect';
    const lang = languages.find(l => l.code === code);
    return lang?.name || code.toUpperCase();
  };

  const renderTranslationHistory = () => (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#06b6d4' }}>
            Translation History
          </Typography>
          {translationHistory.length > 0 && (
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
        
        {translationHistory.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No translation history yet
          </Typography>
        ) : (
          <List>
            {translationHistory.slice(0, 10).map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    dispatch(setOriginalText(item.originalText));
                    dispatch(setSourceLang(item.sourceLang));
                    dispatch(setTargetLang(item.targetLang));
                  }}
                >
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {item.originalText}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#06b6d4', mt: 1 }}>
                          {item.translatedText}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {getLanguageName(item.sourceLang)} → {getLanguageName(item.targetLang)} • {' '}
                        {new Date(item.timestamp).toLocaleDateString()}
                      </Typography>
                    }
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
        title="Translator"
        subtitle="Translate text between multiple languages instantly"
        icon={<TranslateIcon />}
      />

      {/* Language Selection */}
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>From</InputLabel>
              <Select
                value={sourceLang}
                onChange={(e) => dispatch(setSourceLang(e.target.value))}
                label="From"
              >
                <MenuItem value="auto">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoDetectIcon fontSize="small" />
                    Auto-detect
                  </Box>
                </MenuItem>
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Swap languages">
              <IconButton
                onClick={handleSwapLanguages}
                disabled={sourceLang === 'auto'}
                sx={{ color: '#06b6d4' }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Tooltip>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>To</InputLabel>
              <Select
                value={targetLang}
                onChange={(e) => dispatch(setTargetLang(e.target.value))}
                label="To"
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {detectedLanguage && sourceLang === 'auto' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Detected language: {getLanguageName(detectedLanguage.language)} 
              ({Math.round(detectedLanguage.confidence * 100)}% confidence)
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Alert>
      )}

      {/* Translation Interface */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Input Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#06b6d4' }}>
                  {getLanguageName(sourceLang)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Clear text">
                    <IconButton
                      onClick={() => {
                        dispatch(setOriginalText(''));
                        dispatch(clearTranslation());
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Listen">
                    <IconButton
                      onClick={() => speakText(originalText, sourceLang)}
                      disabled={!originalText.trim()}
                      sx={{ color: '#06b6d4' }}
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Enter text to translate... Try full sentences like 'How are you today?' or 'Where is the train station?'"
                value={originalText}
                onChange={(e) => dispatch(setOriginalText(e.target.value))}
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

              {/* Example Sentences */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                  💡 Try these example sentences:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    'How are you today?',
                    'What is your name?',
                    'Where is the bathroom?',
                    'I need help',
                    'Nice to meet you',
                    'Do you speak English?'
                  ].map((example) => (
                    <Button
                      key={example}
                      size="small"
                      variant="outlined"
                      onClick={() => dispatch(setOriginalText(example))}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1,
                        '&:hover': {
                          borderColor: '#06b6d4',
                          backgroundColor: 'rgba(6, 182, 212, 0.1)'
                        }
                      }}
                    >
                      {example}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleTranslate}
                  disabled={loading || !originalText.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <TranslateIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minWidth: 150
                  }}
                >
                  Translate
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Output Section */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#06b6d4' }}>
                  {getLanguageName(targetLang)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy translation">
                    <IconButton
                      onClick={() => copyToClipboard(translatedText)}
                      disabled={!translatedText}
                      sx={{ color: '#06b6d4' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Listen">
                    <IconButton
                      onClick={() => speakText(translatedText, targetLang)}
                      disabled={!translatedText}
                      sx={{ color: '#06b6d4' }}
                    >
                      <VolumeUpIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box
                sx={{
                  minHeight: 200,
                  p: 2,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: translatedText ? 'flex-start' : 'center',
                  justifyContent: translatedText ? 'flex-start' : 'center'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Translating...
                    </Typography>
                  </Box>
                ) : translatedText ? (
                  <Typography sx={{ color: 'white', whiteSpace: 'pre-wrap' }}>
                    {translatedText}
                  </Typography>
                ) : (
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Translation will appear here
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* History Section */}
      <Box sx={{ mt: 3 }}>
        {renderTranslationHistory()}
      </Box>
    </Container>
  );
};

export default Translator;