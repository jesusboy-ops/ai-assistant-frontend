// Obligation Form Component - Create and edit life obligations
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { createObligation, updateObligation, fetchObligations } from '../../store/slices/lifeAdminSlice';
import toast from '../../utils/toast';

const ObligationForm = ({ open, onClose, obligation = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    type: 'deadline',
    due_date: null,
    consequence: '',
    risk_level: 'medium'
  });

  // Categories and types options
  const categories = [
    { value: 'financial', label: 'Financial' },
    { value: 'legal', label: 'Legal' },
    { value: 'health', label: 'Health' },
    { value: 'personal', label: 'Personal' },
    { value: 'professional', label: 'Professional' },
    { value: 'education', label: 'Education' },
    { value: 'family', label: 'Family' },
    { value: 'government', label: 'Government' }
  ];

  const types = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'reminder', label: 'Reminder' }
  ];

  const riskLevels = [
    { value: 'low', label: 'Low', description: 'Minor inconvenience if missed' },
    { value: 'medium', label: 'Medium', description: 'Moderate consequences if missed' },
    { value: 'high', label: 'High', description: 'Severe consequences if missed' }
  ];

  // Initialize form data when obligation changes
  useEffect(() => {
    if (obligation) {
      setFormData({
        title: obligation.title || '',
        description: obligation.description || '',
        category: obligation.category || 'personal',
        type: obligation.type || 'deadline',
        due_date: obligation.due_date ? new Date(obligation.due_date) : null,
        consequence: obligation.consequence || '',
        risk_level: obligation.risk_level || 'medium'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        type: 'deadline',
        due_date: null,
        consequence: '',
        risk_level: 'medium'
      });
    }
    setErrors({});
  }, [obligation, open]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.risk_level) {
      newErrors.risk_level = 'Risk level is required';
    }

    // Due date validation for certain types
    if (formData.type === 'deadline' && !formData.due_date) {
      newErrors.due_date = 'Due date is required for deadlines';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString().split('T')[0] : null
      };

      if (obligation) {
        // Update existing obligation
        await dispatch(updateObligation({ id: obligation.id, data: submitData })).unwrap();
        toast.success('Obligation updated successfully');
      } else {
        // Create new obligation
        await dispatch(createObligation(submitData)).unwrap();
        toast.success('Obligation created successfully');
      }

      // Refresh obligations list
      dispatch(fetchObligations());
      
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save obligation');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogTitle>
          {obligation ? 'Edit Obligation' : 'Create New Obligation'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={Boolean(errors.title)}
                helperText={errors.title}
                required
                placeholder="e.g., File tax returns, Renew driver's license"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
                placeholder="Additional details about this obligation..."
              />
            </Grid>

            {/* Category and Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={Boolean(errors.category)}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={Boolean(errors.type)}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  {types.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.type}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Due Date */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formData.due_date}
                onChange={(date) => handleChange('due_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.due_date),
                    helperText: errors.due_date,
                    required: formData.type === 'deadline'
                  }
                }}
                minDate={new Date()}
              />
            </Grid>

            {/* Risk Level */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={Boolean(errors.risk_level)}>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={formData.risk_level}
                  label="Risk Level"
                  onChange={(e) => handleChange('risk_level', e.target.value)}
                >
                  {riskLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {level.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.risk_level && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.risk_level}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Consequence */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Consequence (if missed)"
                value={formData.consequence}
                onChange={(e) => handleChange('consequence', e.target.value)}
                multiline
                rows={2}
                placeholder="What happens if this obligation is not met?"
              />
            </Grid>

            {/* Risk Level Info */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Risk Level Guidelines:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  • <strong>High:</strong> Legal issues, financial penalties, health risks
                </Typography>
                <Typography variant="body2" component="div">
                  • <strong>Medium:</strong> Missed opportunities, moderate inconvenience
                </Typography>
                <Typography variant="body2" component="div">
                  • <strong>Low:</strong> Minor inconvenience, easily rescheduled
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Saving...' : (obligation ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ObligationForm;