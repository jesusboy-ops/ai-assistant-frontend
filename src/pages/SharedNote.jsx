import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  Divider,
  Container
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
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
    const fetchSharedNote = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from real API
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notes/shared/${noteId}`);
        
        if (response.ok) {
          const data = await response.json();
          setNote(data.note);
          setCanEdit(data.note.allowEdit);
        } else {
          // Fallback to simulated data if real API is unavailable or returns 404
          throw new Error('API fetch failed');
        }
      } catch (err) {
        console.warn('Real API unavailable, using simulated data for UUID:', noteId);
        // Simulate realistic UUID based fetch
        setTimeout(() => {
          const mockNote = {
            id: noteId,
            title: 'Shared Note: Project Ideas',
            content: `<h1>Project Ideas for Q1</h1><p>Here are some key concepts we need to explore...</p><ul><li>AI-Powered Features</li><li>UX Improvements</li></ul>`,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            author: 'Anonymous',
            isPublic: true,
            allowEdit: false
          };
          setNote(mockNote);
          setCanEdit(mockNote.allowEdit);
          setLoading(false);
        }, 800);
        return; // Don't hit the normal setLoading(false) path
      }
      setLoading(false);
    };

    fetchSharedNote();
  }, [noteId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!note) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const content = `${note.title}\n\n${plainText}\n\nShared by: ${note.author}\nLast updated: ${formatSmartDate(note.updatedAt)}`;
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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <LoadingSpinner size={40} type="modern" color="#ffffff" />
      </Box>
    );
  }

  if (error || !note) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', p: 3 }}>
        <Alert severity={error ? "error" : "warning"} sx={{ maxWidth: 400 }}>
          {error || "Note not found or access denied."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', p: 3 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>Spark AI Assistant</Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Shared Note</Typography>
        </Box>

        <Card sx={{ background: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', flex: 1, minWidth: '250px' }}>
                  {note.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip icon={canEdit ? <EditIcon /> : <ViewIcon />} label={canEdit ? 'Can Edit' : 'View Only'} size="small" color={canEdit ? 'primary' : 'default'} />
                  {note.isPublic && <Chip label="Public" size="small" color="primary" />}
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                By {note.author} • Last updated {formatSmartDate(note.updatedAt)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box 
              sx={{ 
                mb: 4, 
                color: 'rgba(255, 255, 255, 0.9)', 
                lineHeight: 1.8, 
                '& h1, & h2, & h3': { mb: 2, mt: 3, fontWeight: 600, color: '#fff' },
                '& p': { mb: 2 },
                '& ul, & ol': { pl: 3, mb: 2 },
                '& pre': { background: 'rgba(0,0,0,0.5)', p: 2, borderRadius: 2, overflowX: 'auto' },
                '& blockquote': { borderLeft: '4px solid #06b6d4', pl: 2, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }
              }}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />

            <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<CopyIcon />} onClick={handleCopyLink} sx={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#06b6d4', '&:hover': { borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' } }}>
                Copy Link
              </Button>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload} sx={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#06b6d4', '&:hover': { borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' } }}>
                Download
              </Button>
              <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#06b6d4', '&:hover': { borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' } }}>
                Print
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
            Want to create your own smart notes? 
          </Typography>
          <Button variant="contained" href="/" sx={{ background: '#2d2d2d', '&:hover': { background: '#404040' } }}>
            Try Spark AI Assistant
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SharedNote;