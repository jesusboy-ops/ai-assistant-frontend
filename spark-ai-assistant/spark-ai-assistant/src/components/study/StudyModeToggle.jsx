// Study Mode Toggle Component
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Switch,
  Typography,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  School as StudyIcon,
  Topic as TopicIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { toggleStudyMode, setStudyTopic, setStudyFile, clearSession } from '../../store/slices/studySlice';

const StudyModeToggle = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { isStudyMode, currentTopic, currentFile } = useSelector((state) => state.study);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [fileInput, setFileInput] = useState('');

  const handleToggle = () => {
    if (!isStudyMode) {
      setShowSetupDialog(true);
    } else {
      // Confirm exit study mode
      if (window.confirm('Exit Study Mode? Your current session will be saved to history.')) {
        dispatch(clearSession());
        dispatch(toggleStudyMode());
      }
    }
  };

  const handleSetupStudyMode = () => {
    if (topicInput.trim()) {
      dispatch(setStudyTopic(topicInput.trim()));
      if (fileInput.trim()) {
        dispatch(setStudyFile(fileInput.trim()));
      }
      setShowSetupDialog(false);
      setTopicInput('');
      setFileInput('');
    }
  };

  const handleCancel = () => {
    setShowSetupDialog(false);
    setTopicInput('');
    setFileInput('');
  };

  // Mobile layout - Icon button only
  if (isMobile) {
    return (
      <>
        <Tooltip title={isStudyMode ? `Study Mode: ${currentTopic || 'Active'}` : 'Enable Study Mode'}>
          <IconButton
            onClick={handleToggle}
            sx={{
              color: isStudyMode ? theme.palette.primary.main : theme.palette.text.secondary,
              backgroundColor: isStudyMode ? theme.palette.primary.main + '20' : 'transparent',
              border: isStudyMode ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
              '&:hover': {
                backgroundColor: isStudyMode ? theme.palette.primary.main + '30' : theme.palette.action.hover
              }
            }}
          >
            <StudyIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Dialog open={showSetupDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StudyIcon color="primary" />
              <Typography variant="h6">Setup Study Mode</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Study Mode will focus AI responses on your chosen topic with structured formatting, 
              key points, examples, and practice questions.
            </Alert>
            
            <TextField
              fullWidth
              label="Study Topic or Subject"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., JavaScript Promises, World War II, Calculus"
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Book or File Reference (Optional)"
              value={fileInput}
              onChange={(e) => setFileInput(e.target.value)}
              placeholder="e.g., Chapter 5: Async Programming, uploaded-document.pdf"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button 
              onClick={handleSetupStudyMode} 
              variant="contained"
              disabled={!topicInput.trim()}
            >
              Start Study Mode
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Tablet layout - Compact switch with minimal chips
  if (isTablet) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isStudyMode}
                onChange={handleToggle}
                color="primary"
                size="small"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StudyIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Study
                </Typography>
              </Box>
            }
            sx={{ margin: 0 }}
          />
          
          {isStudyMode && currentTopic && (
            <Chip
              label={currentTopic.length > 15 ? currentTopic.substring(0, 15) + '...' : currentTopic}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          )}
        </Box>

        <Dialog open={showSetupDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StudyIcon color="primary" />
              <Typography variant="h6">Setup Study Mode</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Study Mode will focus AI responses on your chosen topic with structured formatting, 
              key points, examples, and practice questions.
            </Alert>
            
            <TextField
              fullWidth
              label="Study Topic or Subject"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., JavaScript Promises, World War II, Calculus"
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Book or File Reference (Optional)"
              value={fileInput}
              onChange={(e) => setFileInput(e.target.value)}
              placeholder="e.g., Chapter 5: Async Programming, uploaded-document.pdf"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button 
              onClick={handleSetupStudyMode} 
              variant="contained"
              disabled={!topicInput.trim()}
            >
              Start Study Mode
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Desktop layout - Full switch with chips
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isStudyMode}
              onChange={handleToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StudyIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" fontWeight={600}>
                Study Mode
              </Typography>
            </Box>
          }
        />
        
        {isStudyMode && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentTopic && (
              <Chip
                icon={<TopicIcon />}
                label={currentTopic}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {currentFile && (
              <Chip
                icon={<FileIcon />}
                label={currentFile}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <Dialog open={showSetupDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StudyIcon color="primary" />
            <Typography variant="h6">Setup Study Mode</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Study Mode will focus AI responses on your chosen topic with structured formatting, 
            key points, examples, and practice questions.
          </Alert>
          
          <TextField
            fullWidth
            label="Study Topic or Subject"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g., JavaScript Promises, World War II, Calculus"
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Book or File Reference (Optional)"
            value={fileInput}
            onChange={(e) => setFileInput(e.target.value)}
            placeholder="e.g., Chapter 5: Async Programming, uploaded-document.pdf"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSetupStudyMode} 
            variant="contained"
            disabled={!topicInput.trim()}
          >
            Start Study Mode
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudyModeToggle;