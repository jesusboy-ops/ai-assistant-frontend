// Rich Text Editor Component with AI-assisted features
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  SmartToy as AIIcon,
  Summarize as SummarizeIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatSize as HeaderIcon
} from '@mui/icons-material';
import { showToast } from '../utils/toast';

const RichTextEditor = ({ 
  content = '', 
  onChange, 
  onSave, 
  onShare,
  placeholder = 'Start writing...',
  aiEnabled = true,
  shareEnabled = true 
}) => {
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(content);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    shareType: 'internal',
    allowEdit: false,
    expiresIn: '7days',
    recipients: ''
  });

  useEffect(() => {
    if (editorRef.current && content !== editorContent) {
      editorRef.current.innerHTML = content;
      setEditorContent(content);
    }
  }, [content]);

  // Format text commands
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  // Update content and notify parent
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  // AI-powered text summarization
  const handleAISummarize = async () => {
    if (!editorContent.trim()) {
      showToast.error('No content to summarize');
      return;
    }

    setIsAIProcessing(true);
    try {
      // Extract plain text from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorContent;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';

      if (plainText.length < 100) {
        showToast.error('Content too short for summarization');
        return;
      }

      // Simulate AI summarization (replace with actual AI service)
      const summary = await generateAISummary(plainText);
      
      // Insert summary at the beginning
      const summaryHTML = `
        <div style="background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; padding: 12px; margin: 16px 0; border-radius: 4px;">
          <strong>AI Summary:</strong><br/>
          ${summary}
        </div>
      `;
      
      editorRef.current.innerHTML = summaryHTML + editorContent;
      updateContent();
      showToast.success('AI summary generated');

    } catch (error) {
      console.error('AI summarization failed:', error);
      showToast.error('Failed to generate summary');
    } finally {
      setIsAIProcessing(false);
    }
  };

  // AI-powered content enhancement
  const handleAIEnhance = async () => {
    if (!editorContent.trim()) {
      showToast.error('No content to enhance');
      return;
    }

    setIsAIProcessing(true);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorContent;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';

      // Simulate AI enhancement
      const enhancements = await generateAIEnhancements(plainText);
      
      if (enhancements.suggestions.length > 0) {
        showToast.success(`Found ${enhancements.suggestions.length} enhancement suggestions`);
        // You could show suggestions in a sidebar or modal
      }

    } catch (error) {
      console.error('AI enhancement failed:', error);
      showToast.error('Failed to enhance content');
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  // Handle header formatting
  const handleHeaderFormat = (level) => {
    formatText('formatBlock', `h${level}`);
    setHeaderMenuAnchor(null);
  };

  // Save content
  const handleSave = () => {
    if (onSave) {
      onSave(editorContent);
      showToast.success('Content saved');
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!shareEnabled) return;
    
    if (shareSettings.shareType === 'internal') {
      // Internal sharing within the app
      const shareData = {
        content: editorContent,
        settings: shareSettings,
        sharedAt: new Date().toISOString()
      };
      
      if (onShare) {
        const result = await onShare(shareData);
        if (result.success) {
          showToast.success('Note shared successfully');
          setShareDialogOpen(false);
        } else {
          showToast.error('Failed to share note');
        }
      }
    } else {
      // External sharing
      await handleExternalShare();
    }
  };

  // External sharing (WhatsApp, Email, etc.)
  const handleExternalShare = async () => {
    try {
      // Create shareable link
      const shareableLink = await createShareableLink(editorContent, shareSettings);
      
      if (shareSettings.shareType === 'whatsapp') {
        const message = `Check out this note: ${shareableLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else if (shareSettings.shareType === 'email') {
        const subject = 'Shared Note';
        const body = `I wanted to share this note with you: ${shareableLink}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(emailUrl);
      } else if (shareSettings.shareType === 'copy') {
        await navigator.clipboard.writeText(shareableLink);
        showToast.success('Share link copied to clipboard');
      }
      
      setShareDialogOpen(false);
    } catch (error) {
      console.error('External sharing failed:', error);
      showToast.error('Failed to create share link');
    }
  };

  // Render share dialog
  const renderShareDialog = () => (
    <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Share Note</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Share Method</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                { value: 'internal', label: 'Internal Users' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'email', label: 'Email' },
                { value: 'copy', label: 'Copy Link' }
              ].map(option => (
                <Chip
                  key={option.value}
                  label={option.label}
                  variant={shareSettings.shareType === option.value ? 'filled' : 'outlined'}
                  onClick={() => setShareSettings(prev => ({ ...prev, shareType: option.value }))}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {shareSettings.shareType === 'internal' && (
            <TextField
              label="Recipients (email addresses, comma-separated)"
              value={shareSettings.recipients}
              onChange={(e) => setShareSettings(prev => ({ ...prev, recipients: e.target.value }))}
              multiline
              rows={2}
              fullWidth
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={shareSettings.allowEdit}
                onChange={(e) => setShareSettings(prev => ({ ...prev, allowEdit: e.target.checked }))}
              />
            }
            label="Allow recipients to edit"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>Link Expires</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                { value: '1day', label: '1 Day' },
                { value: '7days', label: '7 Days' },
                { value: '30days', label: '30 Days' },
                { value: 'never', label: 'Never' }
              ].map(option => (
                <Chip
                  key={option.value}
                  label={option.label}
                  variant={shareSettings.expiresIn === option.value ? 'filled' : 'outlined'}
                  onClick={() => setShareSettings(prev => ({ ...prev, expiresIn: option.value }))}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleShare} variant="contained">Share</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar 
        variant="dense" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          minHeight: '48px !important',
          gap: 1
        }}
      >
        {/* Undo/Redo */}
        <Tooltip title="Undo">
          <IconButton size="small" onClick={() => formatText('undo')}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton size="small" onClick={() => formatText('redo')}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Text Formatting */}
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => formatText('bold')}>
            <BoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => formatText('italic')}>
            <ItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => formatText('underline')}>
            <UnderlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Headers */}
        <Tooltip title="Headers">
          <IconButton 
            size="small" 
            onClick={(e) => setHeaderMenuAnchor(e.currentTarget)}
          >
            <HeaderIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={headerMenuAnchor}
          open={Boolean(headerMenuAnchor)}
          onClose={() => setHeaderMenuAnchor(null)}
        >
          {[1, 2, 3, 4, 5, 6].map(level => (
            <MenuItem key={level} onClick={() => handleHeaderFormat(level)}>
              <Typography variant={`h${Math.min(6, level + 1)}`}>
                Heading {level}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Lists */}
        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => formatText('insertUnorderedList')}>
            <BulletListIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton size="small" onClick={() => formatText('insertOrderedList')}>
            <NumberListIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Quote and Code */}
        <Tooltip title="Quote">
          <IconButton size="small" onClick={() => formatText('formatBlock', 'blockquote')}>
            <QuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Code">
          <IconButton size="small" onClick={() => formatText('formatBlock', 'pre')}>
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Links and Images */}
        <Tooltip title="Insert Link">
          <IconButton size="small" onClick={insertLink}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={insertImage}>
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {aiEnabled && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            {/* AI Features */}
            <Tooltip title="AI Summarize">
              <IconButton 
                size="small" 
                onClick={handleAISummarize}
                disabled={isAIProcessing}
                sx={{ color: isAIProcessing ? 'rgba(255, 255, 255, 0.3)' : '#06b6d4' }}
              >
                <SummarizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="AI Enhance">
              <IconButton 
                size="small" 
                onClick={handleAIEnhance}
                disabled={isAIProcessing}
                sx={{ color: isAIProcessing ? 'rgba(255, 255, 255, 0.3)' : '#06b6d4' }}
              >
                <AIIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        {shareEnabled && (
          <Tooltip title="Share">
            <IconButton size="small" onClick={() => setShareDialogOpen(true)}>
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Save">
          <IconButton size="small" onClick={handleSave}>
            <SaveIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onBlur={updateContent}
        sx={{
          minHeight: 300,
          maxHeight: 600,
          overflowY: 'auto',
          padding: 2,
          outline: 'none',
          color: 'white',
          fontSize: '14px',
          lineHeight: 1.6,
          '&:empty::before': {
            content: `"${placeholder}"`,
            color: 'rgba(255, 255, 255, 0.5)',
            fontStyle: 'italic'
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '16px 0 8px 0',
            fontWeight: 600
          },
          '& p': {
            margin: '8px 0'
          },
          '& ul, & ol': {
            margin: '8px 0',
            paddingLeft: '24px'
          },
          '& blockquote': {
            margin: '16px 0',
            paddingLeft: '16px',
            borderLeft: '4px solid #06b6d4',
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.8)'
          },
          '& pre': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontFamily: 'monospace'
          },
          '& a': {
            color: '#06b6d4',
            textDecoration: 'underline'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px'
          }
        }}
        dangerouslySetInnerHTML={{ __html: editorContent }}
      />

      {/* Share Dialog */}
      {renderShareDialog()}
    </Box>
  );
};

// AI helper functions (these would connect to actual AI services)
const generateAISummary = async (text) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple extractive summarization (replace with actual AI service)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const summary = sentences.slice(0, Math.min(3, Math.ceil(sentences.length * 0.3))).join('. ');
  
  return summary + (summary.endsWith('.') ? '' : '.');
};

const generateAIEnhancements = async (text) => {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const suggestions = [];
  
  // Simple grammar and style suggestions
  if (text.includes('very')) {
    suggestions.push({
      type: 'style',
      message: 'Consider replacing "very" with more specific adjectives',
      severity: 'low'
    });
  }
  
  if (text.split(' ').length > 500) {
    suggestions.push({
      type: 'structure',
      message: 'Consider breaking this into smaller sections with headers',
      severity: 'medium'
    });
  }
  
  return { suggestions };
};

const createShareableLink = async (content, settings) => {
  // Simulate creating a shareable link
  const shareId = Math.random().toString(36).substr(2, 9);
  const baseUrl = window.location.origin;
  
  // Store the shared content (in a real app, this would go to a backend)
  const shareData = {
    id: shareId,
    content,
    settings,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(`shared_note_${shareId}`, JSON.stringify(shareData));
  
  return `${baseUrl}/shared/${shareId}`;
};

export default RichTextEditor;