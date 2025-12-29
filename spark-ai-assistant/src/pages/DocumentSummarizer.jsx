// Document Summarizer page - File & Document Summarizer
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  NoteAdd as NoteAddIcon,
  ContentCopy as ContentCopyIcon,
  GetApp as GetAppIcon,
  Summarize as SummarizeIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import {
  summarizeDocument,
  fetchUserSummaries,
  deleteSummary,
  saveToNotes,
  clearCurrentSummary,
  setProcessingFile,
  clearProcessingFile
} from '../store/slices/documentSummarizerSlice';
import { documentSummarizerApi } from '../api/documentSummarizerApi';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const DocumentSummarizer = () => {
  const dispatch = useDispatch();
  const {
    summaries,
    currentSummary,
    loading,
    error,
    uploadProgress,
    processingFile
  } = useSelector((state) => state.documentSummarizer);

  const [selectedFile, setSelectedFile] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    dispatch(fetchUserSummaries());
  }, [dispatch]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = documentSummarizerApi.validateFile(file);
    if (!validation.valid) {
      showToast.error(validation.error);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndSummarize = async () => {
    if (!selectedFile) return;

    dispatch(setProcessingFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: documentSummarizerApi.getFileTypeDisplay(selectedFile)
    }));

    try {
      await dispatch(summarizeDocument({
        file: selectedFile,
        options: {
          extractKeyPoints: true,
          generateTags: true
        }
      })).unwrap();
      
      showToast.success('Document summarized successfully');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      showToast.error(error);
      dispatch(clearProcessingFile());
    }
  };

  const handleDeleteSummary = async (summaryId) => {
    try {
      await dispatch(deleteSummary(summaryId)).unwrap();
      showToast.success('Summary deleted successfully');
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleSaveToNotes = async () => {
    if (!selectedSummary || !noteTitle.trim()) {
      showToast.error('Please enter a note title');
      return;
    }

    try {
      await dispatch(saveToNotes({
        summaryId: selectedSummary.id,
        noteTitle: noteTitle.trim()
      })).unwrap();
      
      showToast.success('Summary saved to notes');
      setSaveDialogOpen(false);
      setNoteTitle('');
      setSelectedSummary(null);
    } catch (error) {
      showToast.error(error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success('Copied to clipboard');
    }).catch(() => {
      showToast.error('Failed to copy');
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderUploadSection = () => (
    <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#06b6d4', mb: 2 }}>
          Upload Document
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <Button
            variant="outlined"
            component="label"
            htmlFor="file-upload"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: '#06b6d4',
              color: '#06b6d4',
              borderStyle: 'dashed',
              py: 3,
              '&:hover': {
                borderColor: '#0891b2',
                backgroundColor: 'rgba(6, 182, 212, 0.1)'
              }
            }}
          >
            Choose File (PDF, DOC, DOCX, TXT - Max 10MB)
          </Button>

          {selectedFile && (
            <Card sx={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {documentSummarizerApi.getFileTypeDisplay(selectedFile)} • {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleUploadAndSummarize}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SummarizeIcon />}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Summarize
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {processingFile && (
            <Card sx={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Processing: {processingFile.name}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="indeterminate" 
                  sx={{ 
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#f59e0b'
                    }
                  }} 
                />
              </CardContent>
            </Card>
          )}

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Supported formats: PDF, DOC, DOCX, TXT files up to 10MB
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCurrentSummary = () => {
    if (!currentSummary) return null;

    return (
      <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#06b6d4' }}>
              Latest Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy summary">
                <IconButton
                  onClick={() => copyToClipboard(currentSummary.summary)}
                  sx={{ color: '#06b6d4' }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save to notes">
                <IconButton
                  onClick={() => {
                    setSelectedSummary(currentSummary);
                    setNoteTitle(`Summary: ${currentSummary.fileName}`);
                    setSaveDialogOpen(true);
                  }}
                  sx={{ color: '#06b6d4' }}
                >
                  <NoteAddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Document: {currentSummary.fileName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={currentSummary.fileType}
                size="small"
                sx={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}
              />
              <Chip
                label={`${currentSummary.wordCount} words`}
                size="small"
                sx={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}
              />
            </Box>
          </Box>

          <Typography variant="body1" sx={{ color: 'white', mb: 3, lineHeight: 1.6 }}>
            {currentSummary.summary}
          </Typography>

          {currentSummary.keyPoints && currentSummary.keyPoints.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#667eea', mb: 2 }}>
                Key Points:
              </Typography>
              <List>
                {currentSummary.keyPoints.map((point, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <KeyboardArrowRightIcon sx={{ color: '#06b6d4', mr: 1 }} />
                    <ListItemText
                      primary={point}
                      sx={{ '& .MuiListItemText-primary': { color: 'rgba(255, 255, 255, 0.9)' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {currentSummary.tags && currentSummary.tags.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {currentSummary.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSummaryHistory = () => (
    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#06b6d4', mb: 2 }}>
          Summary History
        </Typography>
        
        {summaries.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            No summaries yet. Upload a document to get started.
          </Typography>
        ) : (
          <List>
            {summaries.map((summary) => (
              <ListItem key={summary.id} disablePadding>
                <ListItemButton
                  onClick={() => dispatch(clearCurrentSummary())}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <DescriptionIcon sx={{ color: '#06b6d4', mr: 2 }} />
                  <ListItemText
                    primary={summary.fileName}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                          {summary.summary.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={summary.fileType}
                            size="small"
                            sx={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}
                          />
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            {new Date(summary.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{
                      '& .MuiListItemText-primary': { color: 'white', fontWeight: 600 }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Save to notes">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSummary(summary);
                          setNoteTitle(`Summary: ${summary.fileName}`);
                          setSaveDialogOpen(true);
                        }}
                        sx={{ color: '#06b6d4' }}
                      >
                        <NoteAddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete summary">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSummary(summary.id);
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderSaveDialog = () => (
    <Dialog
      open={saveDialogOpen}
      onClose={() => {
        setSaveDialogOpen(false);
        setNoteTitle('');
        setSelectedSummary(null);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Save Summary to Notes</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Note Title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setSaveDialogOpen(false);
          setNoteTitle('');
          setSelectedSummary(null);
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveToNotes}
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Save to Notes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Document Summarizer"
        subtitle="AI-powered document analysis and summarization"
        icon={<SummarizeIcon />}
      />

      {/* Upload Section */}
      {renderUploadSection()}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Current Summary */}
      {renderCurrentSummary()}

      {/* Summary History */}
      {renderSummaryHistory()}

      {/* Save Dialog */}
      {renderSaveDialog()}
    </Container>
  );
};

export default DocumentSummarizer;