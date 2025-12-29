// Notes Analysis Component - Detect deadlines and actions in notes
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Notes as NotesIcon,
  Psychology as AIIcon,
  Assignment as ObligationIcon,
  Task as TaskIcon,
  Schedule as DateIcon,
  Add as AddIcon,
  Share as ShareIcon,
  Chat as WhatsAppIcon,
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as SuggestionIcon
} from '@mui/icons-material';

import lifeAdminApi from '../../api/lifeAdminApi';
import { createObligation } from '../../store/slices/lifeAdminSlice';
import { createTask } from '../../store/slices/tasksSlice';
import { fetchNotes } from '../../store/slices/notesSlice';
import toast from '../../utils/toast';

const NotesAnalysis = () => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.notes);
  
  const [selectedNote, setSelectedNote] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [shareDialog, setShareDialog] = useState(false);
  const [shareMethod, setShareMethod] = useState('email');

  // Load notes on component mount
  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  // Analyze note content for deadlines and actions
  const analyzeNote = async (noteContent) => {
    if (!noteContent.trim()) {
      toast.error('Please select a note to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await lifeAdminApi.ai.analyzeNotes(noteContent);
      setAnalysisResult(result);
      
      if (result.suggestions && result.suggestions.length > 0) {
        setShowSuggestionsDialog(true);
        // Initialize all suggestions as selected
        setSelectedSuggestions(result.suggestions.map((_, index) => index));
      } else {
        toast.info('No actionable items detected in this note');
      }
    } catch (error) {
      toast.error('Failed to analyze note');
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle note selection
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setAnalysisResult(null);
  };

  // Handle suggestion toggle
  const handleSuggestionToggle = (index) => {
    setSelectedSuggestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Create tasks and obligations from suggestions
  const handleCreateFromSuggestions = async () => {
    if (!analysisResult || selectedSuggestions.length === 0) {
      toast.error('No suggestions selected');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    try {
      for (const index of selectedSuggestions) {
        const suggestion = analysisResult.suggestions[index];
        
        try {
          if (suggestion.type === 'obligation') {
            await dispatch(createObligation({
              title: suggestion.title,
              description: suggestion.description,
              category: suggestion.category || 'personal',
              type: suggestion.obligation_type || 'deadline',
              due_date: suggestion.due_date,
              risk_level: suggestion.risk_level || 'medium',
              consequence: suggestion.consequence
            })).unwrap();
            successCount++;
          } else if (suggestion.type === 'task') {
            await dispatch(createTask({
              title: suggestion.title,
              description: suggestion.description,
              priority: suggestion.priority || 'medium',
              due_date: suggestion.due_date,
              ai_generated: true
            })).unwrap();
            successCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} items from note analysis`);
      }
      if (errorCount > 0) {
        toast.warning(`Failed to create ${errorCount} items`);
      }

      setShowSuggestionsDialog(false);
      setSelectedSuggestions([]);
      setAnalysisResult(null);
      
    } catch (error) {
      toast.error('Failed to create items from suggestions');
    }
  };

  // Handle note sharing
  const handleShareNote = (method) => {
    if (!selectedNote) {
      toast.error('Please select a note to share');
      return;
    }

    const noteContent = `${selectedNote.title}\n\n${selectedNote.content}`;
    
    if (method === 'email') {
      const subject = encodeURIComponent(`Note: ${selectedNote.title}`);
      const body = encodeURIComponent(noteContent);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    } else if (method === 'whatsapp') {
      const text = encodeURIComponent(noteContent);
      window.open(`https://wa.me/?text=${text}`);
    }
    
    setShareDialog(false);
    toast.success(`Note shared via ${method}`);
  };

  // Get suggestion type color
  const getSuggestionTypeColor = (type) => {
    switch (type) {
      case 'obligation': return 'error';
      case 'task': return 'primary';
      case 'reminder': return 'warning';
      default: return 'default';
    }
  };

  // Get suggestion type icon
  const getSuggestionTypeIcon = (type) => {
    switch (type) {
      case 'obligation': return <ObligationIcon />;
      case 'task': return <TaskIcon />;
      case 'reminder': return <DateIcon />;
      default: return <SuggestionIcon />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <NotesIcon color="primary" sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h5" component="h2">
            Notes Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detect deadlines and actionable items in your notes using AI
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Notes List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Notes
              </Typography>
              
              {notes.length === 0 ? (
                <Alert severity="info">
                  No notes available. Create some notes first to analyze them.
                </Alert>
              ) : (
                <List>
                  {notes.map((note) => (
                    <ListItem 
                      key={note.id} 
                      button
                      selected={selectedNote?.id === note.id}
                      onClick={() => handleNoteSelect(note)}
                      divider
                    >
                      <ListItemText
                        primary={note.title}
                        secondary={
                          <Typography variant="body2" noWrap>
                            {note.content.substring(0, 100)}...
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Note Content and Analysis */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {selectedNote ? selectedNote.title : 'Select a Note'}
                </Typography>
                {selectedNote && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={() => setShareDialog(true)}
                      size="small"
                    >
                      Share
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={analyzing ? <CircularProgress size={20} /> : <AIIcon />}
                      onClick={() => analyzeNote(selectedNote.content)}
                      disabled={analyzing}
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </Button>
                  </Box>
                )}
              </Box>

              {selectedNote ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={selectedNote.content}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Analysis Results */}
                  {analysisResult && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Analysis Results
                      </Typography>
                      
                      {analysisResult.deadlines && analysisResult.deadlines.length > 0 && (
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DateIcon sx={{ mr: 1 }} />
                              <Typography>
                                Detected Deadlines ({analysisResult.deadlines.length})
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {analysisResult.deadlines.map((deadline, index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={deadline.text}
                                    secondary={`Date: ${new Date(deadline.date).toLocaleDateString()}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      )}
                      
                      {analysisResult.actions && analysisResult.actions.length > 0 && (
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TaskIcon sx={{ mr: 1 }} />
                              <Typography>
                                Detected Actions ({analysisResult.actions.length})
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {analysisResult.actions.map((action, index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={action.text}
                                    secondary={action.priority ? `Priority: ${action.priority}` : ''}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  Select a note from the list to view its content and analyze it for deadlines and actionable items.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Suggestions Dialog */}
      <Dialog 
        open={showSuggestionsDialog} 
        onClose={() => setShowSuggestionsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SuggestionIcon sx={{ mr: 1 }} />
            AI Suggestions from Note Analysis
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select which suggestions you want to create as obligations or tasks:
          </Typography>
          
          {analysisResult?.suggestions?.map((suggestion, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedSuggestions.includes(index)}
                  onChange={() => handleSuggestionToggle(index)}
                />
              }
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getSuggestionTypeIcon(suggestion.type)}
                    <Typography variant="subtitle2">
                      {suggestion.title}
                    </Typography>
                    <Chip 
                      label={suggestion.type} 
                      color={getSuggestionTypeColor(suggestion.type)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {suggestion.description}
                  </Typography>
                  {suggestion.due_date && (
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(suggestion.due_date).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              }
              sx={{ display: 'block', mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuggestionsDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFromSuggestions}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={selectedSuggestions.length === 0}
          >
            Create Selected Items ({selectedSuggestions.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog 
        open={shareDialog} 
        onClose={() => setShareDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Share Note</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose how you want to share this note:
          </Typography>
          
          <List>
            <ListItem button onClick={() => handleShareNote('email')}>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Share via Email" />
            </ListItem>
            <ListItem button onClick={() => handleShareNote('whatsapp')}>
              <ListItemIcon>
                <WhatsAppIcon />
              </ListItemIcon>
              <ListItemText primary="Share via WhatsApp" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotesAnalysis;