import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Divider,
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
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  SmartToy as AIIcon,
  Summarize as SummarizeIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    shareType: 'internal',
    allowEdit: false,
    expiresIn: '7days',
    recipients: ''
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none tiptap-editor',
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // AI-powered text summarization
  const handleAISummarize = async () => {
    if (!editor || editor.isEmpty) {
      showToast.error('No content to summarize');
      return;
    }

    setIsAIProcessing(true);
    try {
      const plainText = editor.getText();
      
      if (plainText.length < 50) {
        showToast.error('Content too short for summarization');
        return;
      }

      // Simulate streaming AI summarization
      showToast.info('AI is generating a summary...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const summary = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10).slice(0, 2).join('. ') + '.';
      
      const summaryHTML = `
        <blockquote style="background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; padding: 12px; margin: 16px 0; border-radius: 4px;">
          <strong>AI Summary:</strong><br/>
          ${summary}
        </blockquote>
        <p></p>
      `;
      
      editor.commands.insertContentAt(0, summaryHTML);
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
    if (!editor || editor.isEmpty) {
      showToast.error('No content to enhance');
      return;
    }

    setIsAIProcessing(true);
    try {
      showToast.info('AI is analyzing content...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast.success('Found 2 enhancement suggestions! (Simulated)');
    } catch (error) {
      console.error('AI enhancement failed:', error);
      showToast.error('Failed to enhance content');
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSave = () => {
    if (onSave && editor) {
      onSave(editor.getHTML());
      showToast.success('Content saved');
    }
  };

  const renderShareDialog = () => (
    <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Share Note</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Share Method</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['internal', 'whatsapp', 'email', 'copy'].map(opt => (
                <Chip
                  key={opt}
                  label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                  variant={shareSettings.shareType === opt ? 'filled' : 'outlined'}
                  onClick={() => setShareSettings(prev => ({ ...prev, shareType: opt }))}
                  sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => setShareDialogOpen(false)} variant="contained">Share</Button>
      </DialogActions>
    </Dialog>
  );

  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar variant="dense" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', minHeight: '48px !important', gap: 1, flexWrap: 'wrap' }}>
        <Tooltip title="Undo"><IconButton size="small" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><UndoIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton size="small" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><RedoIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Bold"><IconButton size="small" color={editor.isActive('bold') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton size="small" color={editor.isActive('italic') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Bullet List"><IconButton size="small" color={editor.isActive('bulletList') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleBulletList().run()}><BulletListIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Numbered List"><IconButton size="small" color={editor.isActive('orderedList') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleOrderedList().run()}><NumberListIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Quote"><IconButton size="small" color={editor.isActive('blockquote') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleBlockquote().run()}><QuoteIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Code Block"><IconButton size="small" color={editor.isActive('codeBlock') ? 'primary' : 'default'} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><CodeIcon fontSize="small" /></IconButton></Tooltip>

        {aiEnabled && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="AI Summarize">
              <IconButton size="small" onClick={handleAISummarize} disabled={isAIProcessing} sx={{ color: isAIProcessing ? 'rgba(255,255,255,0.3)' : '#06b6d4' }}>
                <SummarizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="AI Enhance">
              <IconButton size="small" onClick={handleAIEnhance} disabled={isAIProcessing} sx={{ color: isAIProcessing ? 'rgba(255,255,255,0.3)' : '#06b6d4' }}>
                <AIIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {shareEnabled && (
          <Tooltip title="Share">
            <IconButton size="small" onClick={() => setShareDialogOpen(true)}><ShareIcon fontSize="small" /></IconButton>
          </Tooltip>
        )}
        <Tooltip title="Save">
          <IconButton size="small" onClick={handleSave}><SaveIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Toolbar>

      <Box sx={{ 
        p: 2, 
        flex: 1, 
        overflowY: 'auto', 
        '& .tiptap-editor': {
          outline: 'none',
          color: 'white',
          fontSize: '15px',
          lineHeight: 1.6,
          minHeight: '250px',
        },
        '& .tiptap-editor p.is-editor-empty:first-of-type::before': {
          content: 'attr(data-placeholder)',
          float: 'left',
          color: 'rgba(255, 255, 255, 0.4)',
          pointerEvents: 'none',
          height: 0,
        },
        '& .tiptap-editor blockquote': {
          borderLeft: '4px solid rgba(255, 255, 255, 0.2)',
          paddingLeft: '1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          fontStyle: 'italic',
        },
        '& .tiptap-editor pre': {
          background: 'rgba(0,0,0,0.5)',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
        }
      }}>
        <EditorContent editor={editor} />
      </Box>

      {renderShareDialog()}
    </Box>
  );
};

export default RichTextEditor;