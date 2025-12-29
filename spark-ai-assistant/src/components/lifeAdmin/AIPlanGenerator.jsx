// AI Plan Generator Component - Generate structured plans from natural language
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as ObligationIcon,
  Task as TaskIcon,
  Notifications as ReminderIcon,
  Email as EmailIcon,
  Event as CalendarIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Psychology as AIIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

import { generateAIPlan, clearAIPlan, createObligation } from '../../store/slices/lifeAdminSlice';
import { createTask } from '../../store/slices/tasksSlice';
import { createReminder } from '../../store/slices/remindersSlice';
import toast from '../../utils/toast';

const AIPlanGenerator = () => {
  const dispatch = useDispatch();
  const { aiPlan, aiPlanLoading, aiPlanError } = useSelector((state) => state.lifeAdmin);
  
  const [input, setInput] = useState('');
  const [context, setContext] = useState({
    category: 'general',
    urgency: 'medium'
  });
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    obligations: [],
    tasks: [],
    reminders: [],
    emails: [],
    calendar: []
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'financial', label: 'Financial' },
    { value: 'legal', label: 'Legal' },
    { value: 'health', label: 'Health' },
    { value: 'personal', label: 'Personal' },
    { value: 'professional', label: 'Professional' },
    { value: 'education', label: 'Education' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait weeks' },
    { value: 'medium', label: 'Medium - Should be done soon' },
    { value: 'high', label: 'High - Urgent, needs immediate attention' }
  ];

  const exampleInputs = [
    "I need to file my tax returns by April 15th. I haven't started yet and need to gather all my documents.",
    "I'm starting a new job next month and need to prepare everything - resign from current job, update insurance, find new apartment.",
    "My driver's license expires in 2 months and I need to renew it. I also need to update my car registration.",
    "I want to plan a wedding for next summer. Need to book venue, send invitations, arrange catering.",
    "I'm moving to a new city in 3 months for work. Need to find housing, transfer utilities, update address everywhere."
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter your request');
      return;
    }

    try {
      await dispatch(generateAIPlan({
        input: input.trim(),
        context: context
      })).unwrap();
      
      toast.success('AI plan generated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to generate plan');
    }
  };

  // Handle example input selection
  const handleExampleSelect = (example) => {
    setInput(example);
  };

  // Handle plan review
  const handleReviewPlan = () => {
    if (!aiPlan) return;
    
    // Initialize selected items with all items selected by default
    const initialSelection = {
      obligations: aiPlan.obligations?.map((_, index) => index) || [],
      tasks: aiPlan.tasks?.map((_, index) => index) || [],
      reminders: aiPlan.reminders?.map((_, index) => index) || [],
      emails: aiPlan.emails?.map((_, index) => index) || [],
      calendar: aiPlan.calendar_events?.map((_, index) => index) || []
    };
    
    setSelectedItems(initialSelection);
    setShowReviewDialog(true);
  };

  // Handle item selection toggle
  const handleItemToggle = (type, index) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].includes(index)
        ? prev[type].filter(i => i !== index)
        : [...prev[type], index]
    }));
  };

  // Handle plan implementation
  const handleImplementPlan = async () => {
    if (!aiPlan) return;

    let successCount = 0;
    let errorCount = 0;

    try {
      // Create selected obligations
      if (aiPlan.obligations && selectedItems.obligations.length > 0) {
        for (const index of selectedItems.obligations) {
          try {
            await dispatch(createObligation(aiPlan.obligations[index])).unwrap();
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }
      }

      // Create selected tasks
      if (aiPlan.tasks && selectedItems.tasks.length > 0) {
        for (const index of selectedItems.tasks) {
          try {
            await dispatch(createTask({
              ...aiPlan.tasks[index],
              ai_generated: true
            })).unwrap();
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }
      }

      // Create selected reminders
      if (aiPlan.reminders && selectedItems.reminders.length > 0) {
        for (const index of selectedItems.reminders) {
          try {
            await dispatch(createReminder({
              ...aiPlan.reminders[index],
              ai_generated: true
            })).unwrap();
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }
      }

      // Show success message
      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} items`);
      }
      if (errorCount > 0) {
        toast.warning(`Failed to create ${errorCount} items`);
      }

      setShowReviewDialog(false);
      dispatch(clearAIPlan());
      setInput('');
      
    } catch (error) {
      toast.error('Failed to implement plan');
    }
  };

  // Clear current plan
  const handleClearPlan = () => {
    dispatch(clearAIPlan());
    setInput('');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AIIcon color="primary" sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h5" component="h2">
            AI Plan Generator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Describe what you need to accomplish and get a structured plan with obligations, tasks, and reminders
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Describe Your Situation
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="What do you need to accomplish?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your situation, goals, or deadlines in natural language..."
                  sx={{ mb: 3 }}
                />

                {/* Context Selectors */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={context.category}
                        label="Category"
                        onChange={(e) => setContext(prev => ({ ...prev, category: e.target.value }))}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Urgency</InputLabel>
                      <Select
                        value={context.urgency}
                        label="Urgency"
                        onChange={(e) => setContext(prev => ({ ...prev, urgency: e.target.value }))}
                      >
                        {urgencyLevels.map((level) => (
                          <MenuItem key={level.value} value={level.value}>
                            {level.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={aiPlanLoading ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={aiPlanLoading || !input.trim()}
                  fullWidth
                  size="large"
                >
                  {aiPlanLoading ? 'Generating Plan...' : 'Generate AI Plan'}
                </Button>
              </Box>

              {/* Example Inputs */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Example Situations:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {exampleInputs.map((example, index) => (
                    <Button
                      key={index}
                      variant="text"
                      size="small"
                      onClick={() => handleExampleSelect(example)}
                      sx={{ 
                        justifyContent: 'flex-start', 
                        textAlign: 'left',
                        textTransform: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      "{example.substring(0, 80)}..."
                    </Button>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Plan */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Generated Plan
                </Typography>
                {aiPlan && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={handleReviewPlan}
                      size="small"
                    >
                      Review & Implement
                    </Button>
                    <IconButton onClick={handleClearPlan} size="small">
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {aiPlanError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {aiPlanError}
                </Alert>
              )}

              {aiPlanLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {!aiPlan && !aiPlanLoading && (
                <Alert severity="info">
                  Enter your situation above and click "Generate AI Plan" to get started.
                </Alert>
              )}

              {aiPlan && (
                <Box>
                  {/* Obligations */}
                  {aiPlan.obligations && aiPlan.obligations.length > 0 && (
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ObligationIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Obligations ({aiPlan.obligations.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {aiPlan.obligations.map((obligation, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Chip 
                                  label={obligation.risk_level} 
                                  color={obligation.risk_level === 'high' ? 'error' : 
                                         obligation.risk_level === 'medium' ? 'warning' : 'success'}
                                  size="small"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={obligation.title}
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {obligation.description}
                                    </Typography>
                                    {obligation.due_date && (
                                      <Typography variant="caption" color="text.secondary">
                                        Due: {new Date(obligation.due_date).toLocaleDateString()}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Tasks */}
                  {aiPlan.tasks && aiPlan.tasks.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TaskIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Tasks ({aiPlan.tasks.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {aiPlan.tasks.map((task, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Chip 
                                  label={task.priority} 
                                  color={task.priority === 'high' ? 'error' : 
                                         task.priority === 'medium' ? 'warning' : 'default'}
                                  size="small"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={task.title}
                                secondary={task.description}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Reminders */}
                  {aiPlan.reminders && aiPlan.reminders.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ReminderIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Reminders ({aiPlan.reminders.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {aiPlan.reminders.map((reminder, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={reminder.title}
                                secondary={`${reminder.days_before} days before due date`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Emails */}
                  {aiPlan.emails && aiPlan.emails.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Email Templates ({aiPlan.emails.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {aiPlan.emails.map((email, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={email.subject}
                                secondary={`To: ${email.to}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Calendar Events */}
                  {aiPlan.calendar_events && aiPlan.calendar_events.length > 0 && (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            Calendar Events ({aiPlan.calendar_events.length})
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {aiPlan.calendar_events.map((event, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={event.title}
                                secondary={`${new Date(event.start_time).toLocaleDateString()} - ${event.description}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Review and Implementation Dialog */}
      <Dialog 
        open={showReviewDialog} 
        onClose={() => setShowReviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review and Select Items to Implement</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select which items you want to add to your system. You can deselect items you don't need.
          </Typography>

          {/* Review Obligations */}
          {aiPlan?.obligations && aiPlan.obligations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Obligations ({selectedItems.obligations.length}/{aiPlan.obligations.length} selected)
              </Typography>
              {aiPlan.obligations.map((obligation, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedItems.obligations.includes(index)}
                      onChange={() => handleItemToggle('obligations', index)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2">{obligation.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {obligation.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>
          )}

          {/* Review Tasks */}
          {aiPlan?.tasks && aiPlan.tasks.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tasks ({selectedItems.tasks.length}/{aiPlan.tasks.length} selected)
              </Typography>
              {aiPlan.tasks.map((task, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedItems.tasks.includes(index)}
                      onChange={() => handleItemToggle('tasks', index)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2">{task.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>
          )}

          {/* Review Reminders */}
          {aiPlan?.reminders && aiPlan.reminders.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reminders ({selectedItems.reminders.length}/{aiPlan.reminders.length} selected)
              </Typography>
              {aiPlan.reminders.map((reminder, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedItems.reminders.includes(index)}
                      onChange={() => handleItemToggle('reminders', index)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2">{reminder.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reminder.days_before} days before due date
                      </Typography>
                    </Box>
                  }
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImplementPlan} 
            variant="contained"
            startIcon={<AddIcon />}
          >
            Implement Selected Items
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIPlanGenerator;