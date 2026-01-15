// Study Actions Component - One-click actions for study responses
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip,
  Typography,
  Collapse,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Note as NoteIcon,
  Quiz as QuizIcon,
  Style as FlashcardIcon,
  Summarize as SummarizeIcon,
  MoreVert as MoreIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { addSessionNote, addSessionQuestion, addSessionFlashcard } from '../../store/slices/studySlice';
import { createNote } from '../../store/slices/notesSlice';
import toast from '../../utils/toast';

const StudyActions = ({ messageContent, isVisible = true }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { isStudyMode, currentTopic, sessionQuestions, sessionFlashcards, sessionNotes } = useSelector((state) => state.study);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [lastGenerated, setLastGenerated] = useState({ questions: [], flashcards: [], summary: null });

  if (!isStudyMode || !messageContent) {
    return null;
  }

  const handleSaveAsNote = async () => {
    try {
      // Save to both notes and study session
      const noteData = {
        title: `Study Note: ${currentTopic || 'AI Chat'}`,
        content: messageContent,
        tags: ['study', currentTopic?.toLowerCase().replace(/\s+/g, '-')].filter(Boolean)
      };
      
      await dispatch(createNote(noteData));
      dispatch(addSessionNote({ content: messageContent }));
      toast.success('Saved as note!');
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleGenerateQuestions = () => {
    try {
      // Extract key concepts and create questions
      const concepts = extractKeyConcepts(messageContent);
      const newQuestions = concepts.map(concept => ({
        question: `What is ${concept}?`,
        answer: `Based on the study material: ${concept} is explained in the context above.`
      }));
      
      newQuestions.forEach(questionData => {
        dispatch(addSessionQuestion(questionData));
      });
      
      setLastGenerated(prev => ({ ...prev, questions: newQuestions }));
      setShowGeneratedContent(true);
      toast.success(`Generated ${newQuestions.length} practice questions!`);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      toast.error('Failed to generate questions');
    }
  };

  const handleCreateFlashcards = () => {
    try {
      // Extract key terms and definitions
      const flashcards = extractFlashcards(messageContent);
      flashcards.forEach(card => {
        dispatch(addSessionFlashcard(card));
      });
      
      setLastGenerated(prev => ({ ...prev, flashcards }));
      setShowGeneratedContent(true);
      toast.success(`Created ${flashcards.length} flashcards!`);
    } catch (error) {
      console.error('Failed to create flashcards:', error);
      toast.error('Failed to create flashcards');
    }
  };

  const handleSummarize = () => {
    try {
      const summary = createSummary(messageContent);
      const summaryNote = { content: `Summary: ${summary}` };
      dispatch(addSessionNote(summaryNote));
      
      setLastGenerated(prev => ({ ...prev, summary }));
      setShowGeneratedContent(true);
      toast.success('Summary created!');
    } catch (error) {
      console.error('Failed to create summary:', error);
      toast.error('Failed to create summary');
    }
  };

  // Helper function to extract key concepts
  const extractKeyConcepts = (content) => {
    const concepts = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      // Look for bullet points or numbered items
      if (line.match(/^[\s]*[-•*]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/)) {
        const concept = line.replace(/^[\s]*[-•*\d.]\s+/, '').trim();
        if (concept.length > 10 && concept.length < 100) {
          concepts.push(concept);
        }
      }
      // Look for bold or emphasized terms
      const boldMatches = line.match(/\*\*([^*]+)\*\*/g);
      if (boldMatches) {
        boldMatches.forEach(match => {
          const term = match.replace(/\*\*/g, '').trim();
          if (term.length > 3 && term.length < 50) {
            concepts.push(term);
          }
        });
      }
    });
    
    return concepts.slice(0, 3); // Limit to 3 questions
  };

  // Helper function to extract flashcards
  const extractFlashcards = (content) => {
    const flashcards = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      // Look for definition patterns
      const definitionMatch = line.match(/^(.+?):\s*(.+)$/);
      if (definitionMatch && definitionMatch[1].length < 50 && definitionMatch[2].length > 10) {
        flashcards.push({
          front: definitionMatch[1].trim(),
          back: definitionMatch[2].trim()
        });
      }
      
      // Look for bold terms followed by explanations
      const boldMatch = line.match(/\*\*([^*]+)\*\*\s*[-:]?\s*(.+)/);
      if (boldMatch && boldMatch[1].length < 50 && boldMatch[2].length > 10) {
        flashcards.push({
          front: boldMatch[1].trim(),
          back: boldMatch[2].trim()
        });
      }
    });
    
    return flashcards.slice(0, 2); // Limit to 2 flashcards
  };

  // Helper function to create summary
  const createSummary = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const keyPoints = lines
      .filter(line => line.match(/^[\s]*[-•*]\s+/) || line.match(/^\d+\.\s+/))
      .slice(0, 3)
      .map(line => line.replace(/^[\s]*[-•*\d.]\s+/, '').trim());
    
    if (keyPoints.length > 0) {
      return keyPoints.join('; ');
    }
    
    // Fallback: take first few sentences
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('. ') + '.';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handleMenuClose();
    switch (action) {
      case 'note':
        handleSaveAsNote();
        break;
      case 'questions':
        handleGenerateQuestions();
        break;
      case 'flashcards':
        handleCreateFlashcards();
        break;
      case 'summarize':
        handleSummarize();
        break;
    }
  };

  // Mobile layout with dropdown menu
  if (isMobile) {
    return (
      <Box sx={{ mt: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<MoreIcon />}
            onClick={handleMenuOpen}
            sx={{
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.main + '10'
              }
            }}
          >
            Study Actions
          </Button>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: 200,
              maxHeight: 300
            }
          }}
        >
          <MenuItem onClick={() => handleMenuAction('note')}>
            <ListItemIcon>
              <NoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Save Note" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('questions')}>
            <ListItemIcon>
              <QuizIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Generate Questions" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('flashcards')}>
            <ListItemIcon>
              <FlashcardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Create Flashcards" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('summarize')}>
            <ListItemIcon>
              <SummarizeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Summarize" />
          </MenuItem>
        </Menu>

        {/* Generated Content Display */}
        {showGeneratedContent && (lastGenerated.questions.length > 0 || lastGenerated.flashcards.length > 0 || lastGenerated.summary) && (
          <Card sx={{ mt: 2, backgroundColor: theme.palette.background.paper }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  Generated Content
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowGeneratedContent(!showGeneratedContent)}
                >
                  {showGeneratedContent ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={showGeneratedContent}>
                <Box sx={{ mt: 1 }}>
                  {lastGenerated.questions.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Questions ({lastGenerated.questions.length}):
                      </Typography>
                      {lastGenerated.questions.map((q, idx) => (
                        <Typography key={idx} variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                          • {q.question}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {lastGenerated.flashcards.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Flashcards ({lastGenerated.flashcards.length}):
                      </Typography>
                      {lastGenerated.flashcards.map((card, idx) => (
                        <Box key={idx} sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                            Q: {card.front}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            A: {card.back}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {lastGenerated.summary && (
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        Summary:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        {lastGenerated.summary}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  }

  // Tablet layout with compact buttons
  if (isTablet) {
    return (
      <Box sx={{ mt: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Tooltip title="Save this response as a note">
            <Button
              variant="outlined"
              size="small"
              startIcon={<NoteIcon />}
              onClick={handleSaveAsNote}
              sx={{ fontSize: '0.7rem', px: 1.5, py: 0.5 }}
            >
              Note
            </Button>
          </Tooltip>
          
          <Tooltip title="Generate practice questions">
            <Button
              variant="outlined"
              size="small"
              startIcon={<QuizIcon />}
              onClick={handleGenerateQuestions}
              sx={{ fontSize: '0.7rem', px: 1.5, py: 0.5 }}
            >
              Questions
            </Button>
          </Tooltip>
          
          <Tooltip title="Create flashcards">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FlashcardIcon />}
              onClick={handleCreateFlashcards}
              sx={{ fontSize: '0.7rem', px: 1.5, py: 0.5 }}
            >
              Cards
            </Button>
          </Tooltip>
          
          <Tooltip title="Create summary">
            <Button
              variant="outlined"
              size="small"
              startIcon={<SummarizeIcon />}
              onClick={handleSummarize}
              sx={{ fontSize: '0.7rem', px: 1.5, py: 0.5 }}
            >
              Summary
            </Button>
          </Tooltip>
        </Box>

        {/* Generated Content Display for Tablet */}
        {showGeneratedContent && (lastGenerated.questions.length > 0 || lastGenerated.flashcards.length > 0 || lastGenerated.summary) && (
          <Card sx={{ mt: 2, backgroundColor: theme.palette.background.paper }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                Generated Content
              </Typography>
              
              {lastGenerated.questions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Chip label={`${lastGenerated.questions.length} Questions`} size="small" color="primary" sx={{ mb: 1 }} />
                  {lastGenerated.questions.map((q, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                      • {q.question}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {lastGenerated.flashcards.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Chip label={`${lastGenerated.flashcards.length} Flashcards`} size="small" color="secondary" sx={{ mb: 1 }} />
                  {lastGenerated.flashcards.map((card, idx) => (
                    <Box key={idx} sx={{ mt: 0.5, p: 1, backgroundColor: theme.palette.action.hover, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {card.front}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {card.back}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {lastGenerated.summary && (
                <Box>
                  <Chip label="Summary" size="small" color="success" sx={{ mb: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {lastGenerated.summary}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    );
  }

  // Desktop layout with button group
  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="Save this response as a note">
            <Button
              startIcon={<NoteIcon />}
              onClick={handleSaveAsNote}
              sx={{ fontSize: '0.75rem' }}
            >
              Save Note
            </Button>
          </Tooltip>
          
          <Tooltip title="Generate practice questions from this content">
            <Button
              startIcon={<QuizIcon />}
              onClick={handleGenerateQuestions}
              sx={{ fontSize: '0.75rem' }}
            >
              Questions
            </Button>
          </Tooltip>
          
          <Tooltip title="Create flashcards from key terms">
            <Button
              startIcon={<FlashcardIcon />}
              onClick={handleCreateFlashcards}
              sx={{ fontSize: '0.75rem' }}
            >
              Flashcards
            </Button>
          </Tooltip>
          
          <Tooltip title="Create a summary of key points">
            <Button
              startIcon={<SummarizeIcon />}
              onClick={handleSummarize}
              sx={{ fontSize: '0.75rem' }}
            >
              Summarize
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {/* Generated Content Display for Desktop */}
      {showGeneratedContent && (lastGenerated.questions.length > 0 || lastGenerated.flashcards.length > 0 || lastGenerated.summary) && (
        <Card sx={{ mt: 2, backgroundColor: theme.palette.background.paper }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
              Generated Content
            </Typography>
            
            {lastGenerated.questions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Chip label={`${lastGenerated.questions.length} Questions Generated`} size="small" color="primary" sx={{ mb: 2 }} />
                {lastGenerated.questions.map((q, idx) => (
                  <Box key={idx} sx={{ mb: 1, p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Q{idx + 1}: {q.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      A: {q.answer}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {lastGenerated.flashcards.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Chip label={`${lastGenerated.flashcards.length} Flashcards Created`} size="small" color="secondary" sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {lastGenerated.flashcards.map((card, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: theme.palette.action.hover, 
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          Front: {card.front}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Back: {card.back}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {lastGenerated.summary && (
              <Box>
                <Chip label="Summary Created" size="small" color="success" sx={{ mb: 2 }} />
                <Box sx={{ p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 2 }}>
                  <Typography variant="body1">
                    {lastGenerated.summary}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StudyActions;