// Tasks page component
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  Schedule as ScheduleIcon,
  Flag as PriorityIcon
} from '@mui/icons-material';
import { fetchTasks, createTask, updateTask, deleteTask, setFilter, setSortBy, addTaskLocal } from '../store/slices/tasksSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import notificationService from '../services/notificationService';
import toast from '../utils/toast';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks = [], loading, error, filter, sortBy } = useSelector((state) => state.tasks);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'overdue') {
      return task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();
    }
    return true;
  }) : [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Debug logging
  useEffect(() => {
    console.log('📋 Current tasks in state:', tasks);
    console.log('📋 Filtered tasks:', filteredTasks);
    console.log('📋 Sorted tasks:', sortedTasks);
  }, [tasks, filteredTasks, sortedTasks]);

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    console.log('📝 Creating task with form data:', taskForm);
    setSubmitting(true);
    try {
      if (editingTask) {
        const result = await dispatch(updateTask({ id: editingTask.id, updates: taskForm })).unwrap();
        console.log('✅ Task updated result:', result);
        toast.success('Task updated successfully');
        notificationService.createNotification(
          'success',
          'Task Updated',
          `"${taskForm.title}" has been updated`,
          { type: 'task_updated', actionUrl: '/tasks' }
        );
      } else {
        try {
          const result = await dispatch(createTask(taskForm)).unwrap();
          console.log('✅ Task created result:', result);
          toast.success('Task created successfully');
          notificationService.createNotification(
            'success',
            'Task Created',
            `"${taskForm.title}" task has been created`,
            { type: 'task_created', actionUrl: '/tasks' }
          );
        } catch (apiError) {
          console.warn('⚠️ API task creation failed, creating local task:', apiError);
          // Fallback to local task creation
          const localTask = {
            ...taskForm,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocal: true
          };
          dispatch(addTaskLocal(localTask));
          toast.success('Task created locally (API unavailable)');
          notificationService.createNotification(
            'success',
            'Task Created Locally',
            `"${taskForm.title}" task has been created locally`,
            { type: 'task_created_local', actionUrl: '/tasks' }
          );
        }
      }
      
      setShowTaskDialog(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', status: 'pending' });
    } catch (error) {
      console.error('❌ Task creation error:', error);
      toast.error(error || 'Failed to save task');
      notificationService.systemError(new Error(error || 'Failed to save task'), { context: 'task_creation' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate || '',
      status: task.status || 'pending'
    });
    setShowTaskDialog(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        toast.success('Task deleted successfully');
        notificationService.createNotification(
          'info',
          'Task Deleted',
          'Task has been deleted',
          { type: 'task_deleted', actionUrl: '/tasks' }
        );
      } catch (error) {
        toast.error(error || 'Failed to delete task');
        notificationService.systemError(new Error(error || 'Failed to delete task'), { context: 'task_deletion' });
      }
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await dispatch(updateTask({ 
        id: task.id, 
        updates: { ...task, status: newStatus }
      })).unwrap();
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
      notificationService.createNotification(
        newStatus === 'completed' ? 'success' : 'info',
        `Task ${newStatus === 'completed' ? 'Completed' : 'Reopened'}`,
        `"${task.title}" has been ${newStatus === 'completed' ? 'completed' : 'reopened'}`,
        { type: 'task_status_changed', actionUrl: '/tasks' }
      );
    } catch (error) {
      toast.error(error || 'Failed to update task');
      notificationService.systemError(new Error(error || 'Failed to update task'), { context: 'task_status_update' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TaskIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your tasks and to-do items
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {tasks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {tasks.filter(t => t.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {tasks.filter(t => t.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {tasks.filter(t => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Sort */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => dispatch(setFilter(e.target.value))}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="created">Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tasks List */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <LoadingSpinner 
                size={32} 
                type="modern" 
                color="#667eea" 
                text="Loading tasks..." 
              />
            </Box>
          ) : sortedTasks.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create your first task to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowTaskDialog(true)}
              >
                Create Task
              </Button>
            </Box>
          ) : (
            <List>
              {sortedTasks.map((task, index) => (
                <ListItem
                  key={task.id}
                  divider={index < sortedTasks.length - 1}
                  sx={{
                    opacity: task.status === 'completed' ? 0.7 : 1,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                  }}
                >
                  <ListItemIcon>
                    <IconButton
                      onClick={() => handleCompleteTask(task)}
                      color={task.status === 'completed' ? 'success' : 'default'}
                    >
                      <CompleteIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={task.status === 'completed' ? 400 : 600}>
                          {task.title && task.title !== 'null' ? task.title : '[No Title]'}
                        </Typography>
                        <Chip
                          label={task.priority || 'medium'}
                          size="small"
                          color={getPriorityColor(task.priority)}
                          variant="outlined"
                        />
                        <Chip
                          label={task.status || 'pending'}
                          size="small"
                          color={getStatusColor(task.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        {task.description && task.description !== 'null' && task.description.trim() ? (
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No description
                          </Typography>
                        )}
                        {task.dueDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          ID: {task.id} | Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Unknown'}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTask(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowTaskDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  label="Priority"
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            {editingTask && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={taskForm.status}
                    label="Status"
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTaskDialog(false)} disabled={submitting}>Cancel</Button>
          <Button 
            onClick={handleCreateTask} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <LoadingSpinner size={16} type="spin" color="#fff" /> : null}
          >
            {submitting ? 'Saving...' : (editingTask ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;