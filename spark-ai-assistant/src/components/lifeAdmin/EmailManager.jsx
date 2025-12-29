// Email Manager Component - Handle AI-generated emails
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Drafts as DraftsIcon,
  Schedule as ScheduleIcon,
  Mail as MailIcon
} from '@mui/icons-material';

import lifeAdminApi from '../../api/lifeAdminApi';
import toast from '../../utils/toast';

const EmailManager = () => {
  const dispatch = useDispatch();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [createFollowUp, setCreateFollowUp] = useState(false);

  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    body: '',
    priority: 'medium'
  });

  // Handle email form changes
  const handleEmailFormChange = (field, value) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle email editing
  const handleEditEmail = (email) => {
    setSelectedEmail(email);
    setEmailForm({
      to: email.to || '',
      subject: email.subject || '',
      body: email.body || '',
      priority: email.priority || 'medium'
    });
    setEditMode(true);
    setShowEmailDialog(true);
  };

  // Handle save as draft
  const handleSaveDraft = async () => {
    if (!emailForm.subject.trim() || !emailForm.body.trim()) {
      toast.error('Subject and body are required');
      return;
    }

    setLoading(true);
    try {
      await lifeAdminApi.emails.saveDraft(emailForm);
      toast.success('Email saved as draft');
      setShowEmailDialog(false);
      setEmailForm({ to: '', subject: '', body: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  // Handle send email
  const handleSendEmail = async () => {
    if (!emailForm.to.trim() || !emailForm.subject.trim() || !emailForm.body.trim()) {
      toast.error('All fields are required to send email');
      return;
    }

    setLoading(true);
    try {
      await lifeAdminApi.emails.send({
        ...emailForm,
        create_follow_up: createFollowUp
      });
      toast.success('Email sent successfully');
      
      if (createFollowUp) {
        toast.info('Follow-up reminder created');
      }
      
      setShowEmailDialog(false);
      setEmailForm({ to: '', subject: '', body: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  // Handle new email
  const handleNewEmail = () => {
    setSelectedEmail(null);
    setEmailForm({ to: '', subject: '', body: '', priority: 'medium' });
    setEditMode(false);
    setShowEmailDialog(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmailIcon color="primary" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h5" component="h2">
              Email Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage AI-generated emails and templates
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          onClick={handleNewEmail}
        >
          Compose Email
        </Button>
      </Box>

      {/* Email Templates List */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI-Generated Email Templates
              </Typography>
              
              {emails.length === 0 ? (
                <Alert severity="info">
                  No email templates available. Generate emails through the AI Plan Generator.
                </Alert>
              ) : (
                <List>
                  {emails.map((email, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={email.subject}
                        secondary={`To: ${email.to}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditEmail(email)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Integration Options
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gmail Integration"
                    secondary="Send emails directly through Gmail"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Available" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SendIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="SendGrid Integration"
                    secondary="Send emails through SendGrid service"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Available" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Follow-up Reminders"
                    secondary="Automatically create reminders after sending"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Enabled" color="primary" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Compose/Edit Dialog */}
      <Dialog 
        open={showEmailDialog} 
        onClose={() => setShowEmailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Email' : 'Compose Email'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={emailForm.to}
                onChange={(e) => handleEmailFormChange('to', e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailForm.subject}
                onChange={(e) => handleEmailFormChange('subject', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Body"
                value={emailForm.body}
                onChange={(e) => handleEmailFormChange('body', e.target.value)}
                multiline
                rows={8}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={createFollowUp}
                    onChange={(e) => setCreateFollowUp(e.target.checked)}
                  />
                }
                label="Create follow-up reminder after sending"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDraft}
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={loading}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailManager;