import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  Share as ShareIcon,
  Telegram as TelegramIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import toast from '../utils/toast';
import { formatSmartDate } from '../utils/formatDate';

const NoteShareDialog = ({ open, onClose, note }) => {
  if (!note) return null;

  // Format the note content for sharing
  const formatNoteForSharing = () => {
    const formattedDate = formatSmartDate(note.created_at || note.createdAt);
    return `📝 *${note.title}*

${note.content}

📅 Created: ${formattedDate}
✨ Shared from Spark AI Assistant`;
  };

  const shareText = formatNoteForSharing();

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Note content copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Note content copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    toast.success('Opening Telegram...');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Shared Note: ${note.title}`);
    const body = encodeURIComponent(shareText);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
    toast.success('Opening email client...');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Note: ${note.title}`,
          text: shareText
        });
        toast.success('Note shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share note');
        }
      }
    } else {
      // Fallback to copy
      handleCopyText();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon />
          Share Note
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          Share your note content directly with others via messaging apps or copy to clipboard.
        </Alert>

        {/* Preview of what will be shared */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={shareText}
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Share Options */}
        <Typography variant="subtitle2" gutterBottom>
          Share via:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Copy to Clipboard */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CopyIcon />}
            onClick={handleCopyText}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                backgroundColor: 'rgba(102, 126, 234, 0.04)'
              }
            }}
          >
            Copy to Clipboard
          </Button>

          {/* WhatsApp */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppShare}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderColor: '#25d366',
              color: '#25d366',
              '&:hover': {
                borderColor: '#128c7e',
                backgroundColor: 'rgba(37, 211, 102, 0.04)'
              }
            }}
          >
            Share via WhatsApp
          </Button>

          {/* Telegram */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TelegramIcon />}
            onClick={handleTelegramShare}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderColor: '#0088cc',
              color: '#0088cc',
              '&:hover': {
                borderColor: '#006699',
                backgroundColor: 'rgba(0, 136, 204, 0.04)'
              }
            }}
          >
            Share via Telegram
          </Button>

          {/* Email */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={handleEmailShare}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Share via Email
          </Button>

          {/* Native Share (if supported) */}
          {navigator.share && (
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleNativeShare}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                }
              }}
            >
              Share via System
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteShareDialog;