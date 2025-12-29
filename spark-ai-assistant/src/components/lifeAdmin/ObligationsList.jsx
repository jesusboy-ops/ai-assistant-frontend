// Obligations List Component - Display and manage life obligations
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import { 
  fetchObligations, 
  completeObligation, 
  deleteObligation,
  setFilters,
  setPagination 
} from '../../store/slices/lifeAdminSlice';
import ObligationForm from './ObligationForm';
import toast from '../../utils/toast';

const ObligationsList = ({ obligations, loading, onCreateObligation }) => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state) => state.lifeAdmin);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedObligation, setSelectedObligation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  // Risk level color mapping
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Risk level icon mapping
  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return <ErrorIcon fontSize="small" />;
      case 'medium': return <WarningIcon fontSize="small" />;
      case 'low': return <InfoIcon fontSize="small" />;
      default: return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle menu actions
  const handleMenuClick = (event, obligation) => {
    setAnchorEl(event.currentTarget);
    setSelectedObligation(obligation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedObligation(null);
  };

  const handleEdit = () => {
    setShowEditForm(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const handleComplete = async () => {
    try {
      await dispatch(completeObligation(selectedObligation.id)).unwrap();
      toast.success('Obligation marked as completed');
      dispatch(fetchObligations({ ...filters, page: pagination.page, limit: pagination.limit }));
    } catch (error) {
      toast.error('Failed to complete obligation');
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteObligation(selectedObligation.id)).unwrap();
      toast.success('Obligation deleted successfully');
      dispatch(fetchObligations({ ...filters, page: pagination.page, limit: pagination.limit }));
    } catch (error) {
      toast.error('Failed to delete obligation');
    }
    setShowDeleteDialog(false);
    setSelectedObligation(null);
  };

  // Handle filtering
  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
    dispatch(setPagination({ page: 1 })); // Reset to first page
  };

  // Handle sorting
  const handleSort = (field) => {
    const isAsc = filters.sortBy === field && filters.sortOrder === 'asc';
    dispatch(setFilters({
      sortBy: field,
      sortOrder: isAsc ? 'desc' : 'asc'
    }));
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    dispatch(setPagination({ page }));
  };

  return (
    <Box>
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Life Obligations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateObligation}
          >
            Add Obligation
          </Button>
        </Box>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="legal">Legal</MenuItem>
                    <MenuItem value="health">Health</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="deadline">Deadline</MenuItem>
                    <MenuItem value="recurring">Recurring</MenuItem>
                    <MenuItem value="milestone">Milestone</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  onClick={() => dispatch(setFilters({
                    status: 'all',
                    category: 'all',
                    type: 'all',
                    sortBy: 'due_date',
                    sortOrder: 'asc'
                  }))}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Obligations Table */}
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'title'}
                  direction={filters.sortBy === 'title' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'due_date'}
                  direction={filters.sortBy === 'due_date' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('due_date')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'risk_level'}
                  direction={filters.sortBy === 'risk_level' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('risk_level')}
                >
                  Risk Level
                </TableSortLabel>
              </TableCell>
              <TableCell>Days Until Due</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  Loading obligations...
                </TableCell>
              </TableRow>
            ) : obligations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No obligations found. Create your first obligation to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              obligations.map((obligation) => {
                const daysUntilDue = getDaysUntilDue(obligation.due_date);
                return (
                  <TableRow key={obligation.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {obligation.title}
                      </Typography>
                      {obligation.description && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {obligation.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={obligation.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={obligation.type} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(obligation.due_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={obligation.status} 
                        color={getStatusColor(obligation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getRiskIcon(obligation.risk_level)}
                        label={obligation.risk_level} 
                        color={getRiskColor(obligation.risk_level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {daysUntilDue !== null && (
                        <Typography 
                          variant="body2" 
                          color={daysUntilDue < 0 ? 'error' : daysUntilDue <= 7 ? 'warning.main' : 'text.primary'}
                        >
                          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                           daysUntilDue === 0 ? 'Due today' : 
                           `${daysUntilDue} days`}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, obligation)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <InfoIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        {selectedObligation?.status !== 'completed' && (
          <MenuItem onClick={handleComplete}>
            <CompleteIcon sx={{ mr: 1 }} fontSize="small" />
            Mark Complete
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Form Dialog */}
      <ObligationForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        obligation={selectedObligation}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedObligation?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog 
        open={showDetailsDialog} 
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedObligation?.title}</DialogTitle>
        <DialogContent>
          {selectedObligation && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Category</Typography>
                <Chip label={selectedObligation.category} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Type</Typography>
                <Chip label={selectedObligation.type} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Status</Typography>
                <Chip 
                  label={selectedObligation.status} 
                  color={getStatusColor(selectedObligation.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Risk Level</Typography>
                <Chip 
                  icon={getRiskIcon(selectedObligation.risk_level)}
                  label={selectedObligation.risk_level} 
                  color={getRiskColor(selectedObligation.risk_level)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Due Date</Typography>
                <Typography variant="body2">
                  {formatDate(selectedObligation.due_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Created</Typography>
                <Typography variant="body2">
                  {formatDate(selectedObligation.created_at)}
                </Typography>
              </Grid>
              {selectedObligation.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Description</Typography>
                  <Typography variant="body2">
                    {selectedObligation.description}
                  </Typography>
                </Grid>
              )}
              {selectedObligation.consequence && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Consequence</Typography>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {selectedObligation.consequence}
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObligationsList;