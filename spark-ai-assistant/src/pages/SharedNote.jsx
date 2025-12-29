import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Alert,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { formatSmartDate } from '../utils/formatDate';
import toast from '../utils/toast';

const SharedNote = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // Simulate fetching shared note
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockNote = {
        id: noteId,
        title: 'Shared Note: Project Ideas',
        content: `# Project Ideas for Q1 2024

## AI-Powered Features
- Smart task scheduling
- Automated note categorization
- Voice-to-text integration
- Intelligent reminders

## User Experience Improvements
- Dark mode enhancements
- Mobile responsiveness
- Keyboard shortcuts
- Drag & drop functionality

## Technical Enhancements
- Real-time collaboration
- Offline sync
- Performance optimization
- Security improvements

## Next Steps
1. Prioritize features based on user feedback
2. Create detailed technical specifications
3. Set up development timeline
4. Begin implementation phase`,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
        author: 'John Doe',
        isPublic: true,
        allowEdit: false
      };
      
      setNote(mockNote);
      setCanEdit(mockNote.allowEdit);
      setLoading(false);
    }, 1000);
  }, [noteId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!note) return;
    
    const content = `${note.title}\n\n${note.content}\n\nShared by: ${note.author}\nLast updated: ${formatSmartDate(note.updatedAt)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Note downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        }}
      >
        <CircularProgress sx={{ color: '#06b6d4' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!note) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          p: 3
        }}
      >
        <Alert severity="warning" sx={{ maxWidth: 400 }}>
          Note not found or access denied.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        p: 3
      }}
    >
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
            Spark AI Assistant
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Shared Note
          </Typography>
        </Box>

        {/* Note Card */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 3
            }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Note Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', flex: 1 }}>
                  {note.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Chip
                    icon={canEdit ? <EditIcon /> : <ViewIcon />}
                    label={canEdit ? 'Can Edit' : 'View Only'}
                    size="small"
                    color={canEdit ? 'primary' : 'default'}
                  />
                  {note.isPublic && (
                    <Chip
                      label="Public"
                      size="small"
                      color="success"
                    />
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  By {note.author} • Last updated {formatSmartDate(note.updatedAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Note Content */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit'
                }}
              >
                {note.content}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={handleCopyLink}
                sx={{
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                  color: '#06b6d4',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Copy Link
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                  color: '#06b6d4',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Download
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                  color: '#06b6d4',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Print
              </Button>

              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)'
                    }
                  }}
                >
                  Edit Note
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
            Want to create your own notes? 
          </Typography>
          <Button
            variant="contained"
            href="/"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
              }
            }}
          >
            Try Spark AI Assistant
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SharedNote;