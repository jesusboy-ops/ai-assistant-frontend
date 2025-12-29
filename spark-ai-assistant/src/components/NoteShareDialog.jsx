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
  Chip,
  Divider,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon,
  Lock as PrivateIcon
} from '@mui/icons-material';
import toast from '../utils/toast';
import { generateShareUrl, copyToClipboard, shareViaWebAPI, parseEmailList } from '../utils/shareUtils';

const NoteShareDialog = ({ open, onClose, note }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowEdit: false,
    requireAuth: true,
    expiresAt: null
  });
  const [emailRecipients, setEmailRecipients] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [sharedUsers, setSharedUsers] = useState([
    { id: 1, email: 'john@example.com', permission: 'view', sharedAt: '2024-01-15' },
    { id: 2, email: 'jane@example.com', permission: 'edit', sharedAt: '2024-01-14' }
  ]);

  if (!note) return null;

  const shareUrl = generateShareUrl('notes', note.id);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success('Share link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleEmailShare = () => {
    const emails = parseEmailList(emailRecipients);
    
    if (emails.length === 0) {
      toast.error('Please enter at least one valid email address');
      return;
    }

    const subject = `Shared Note: ${note.title}`;
    const body = `${shareMessage}\n\nView the note: ${shareUrl}`;
    
    // In a real app, you'd send this via your backend API
    console.log('Sending email to:', emails, { subject, body });
    toast.success(`Note shared with ${emails.length} recipient(s)!`);
    setEmailRecipients('');
    setShareMessage('');
  };

  const handleWebShare = async () => {
    const result = await shareViaWebAPI({
      title: `Note: ${note.title}`,
      text: note.content.substring(0, 100) + '...',
      url: shareUrl
    });

    if (result.success) {
      toast.success('Note shared successfully!');
    } else if (!result.cancelled) {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleRemoveUser = (userId) => {
    setSharedUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User access removed');
  };

  const handlePermissionChange = (userId, newPermission) => {
    setSharedUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, permission: newPermission } : user
      )
    );
    toast.success('Permission updated');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon />
          Share Note: {note.title}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Share Link" />
          <Tab label="Email Share" />
          <Tab label="Manage Access" />
        </Tabs>

        {/* Share Link Tab */}
        {activeTab === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Anyone with this link can view your note. Adjust privacy settings below.
            </Alert>

            {/* Share URL */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Share URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={shareUrl}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <IconButton onClick={handleCopyLink} color="primary">
                  <CopyIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Privacy Settings */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Privacy Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={shareSettings.isPublic}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {shareSettings.isPublic ? <PublicIcon /> : <PrivateIcon />}
                      {shareSettings.isPublic ? 'Public (anyone can view)' : 'Private (link required)'}
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={shareSettings.allowEdit}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, allowEdit: e.target.checked }))}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {shareSettings.allowEdit ? <EditIcon /> : <ViewIcon />}
                      {shareSettings.allowEdit ? 'Allow editing' : 'View only'}
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={shareSettings.requireAuth}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, requireAuth: e.target.checked }))}
                    />
                  }
                  label="Require sign-in to access"
                />
              </Box>
            </Box>

            {/* Quick Share Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleWebShare}
              >
                Share
              </Button>
            </Box>
          </Box>
        )}

        {/* Email Share Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Send via Email
            </Typography>
            
            <TextField
              fullWidth
              label="Email addresses (comma separated)"
              placeholder="john@example.com, jane@example.com"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message (optional)"
              placeholder="I wanted to share this note with you..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Alert severity="info" sx={{ mb: 2 }}>
              Recipients will receive an email with a link to view this note.
            </Alert>

            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleEmailShare}
              disabled={!emailRecipients.trim()}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Send Email
            </Button>
          </Box>
        )}

        {/* Manage Access Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Shared With
            </Typography>
            
            {sharedUsers.length > 0 ? (
              <List>
                {sharedUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={user.email}
                      secondary={`Shared on ${user.sharedAt} • ${user.permission} access`}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          label={user.permission}
                          size="small"
                          color={user.permission === 'edit' ? 'primary' : 'default'}
                          onClick={() => handlePermissionChange(
                            user.id, 
                            user.permission === 'view' ? 'edit' : 'view'
                          )}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveUser(user.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                This note hasn't been shared with anyone yet.
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Add People
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter email address"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Add user logic here
                    toast.success('User added successfully');
                  }
                }}
              />
              <Button variant="outlined" size="small">
                Add
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteShareDialog;