// Tasks page - AI Task & To-Do Manager
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CalendarToday as CalendarIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskSuggestions,
  setFilter,
  setSortBy
} from '../store/slices/tasksSlice';
import { showToast } from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Tasks = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    tasks,
    loading,
    error,
    suggestions,
    suggestionsLoading,
    filter,
    sortBy
  } = useSelector((state) => state.tasks);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    tags: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated]);

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      showToast.error('Task title is required');
      return;
    }

    try {
      // Format the data to match backend expectations
      const formattedTaskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        due_date: taskForm.dueDate ? 
          (taskForm.dueDate instanceof Date ? 
            taskForm.dueDate.toISOString() : 
            new Date(taskForm.dueDate).toISOString()) : null,
        tags: taskForm.tags || []
      };

      if (editingTask) {
        await dispatch(updateTask({
          taskId: editingTask.id,
          updates: formattedTaskData
        })).unwrap();
        showToast.success('Task updated successfully');
      } else {
        await dispatch(createTask(formattedTaskData)).unwrap();
        showToast.success('Task created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.due_date ? new Date(task.due_date) : null,
      priority: task.priority,
      tags: task.tags || []
    });
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      showToast.success('Task deleted successfully');
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newCompleted = task.status !== 'completed';
      await dispatch(toggleTaskComplete({
        taskId: task.id,
        completed: newCompleted
      })).unwrap();
      showToast.success(newCompleted ? 'Task completed' : 'Task marked as pending');
    } catch (error) {
      showToast.error(error);
    }
  };

  const handleGetSuggestions = async () => {
    if (!taskForm.title.trim()) return;
    
    try {
      await dispatch(getTaskSuggestions(taskForm.title)).unwrap();
    } catch (error) {
      showToast.error(error);
    }
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      dueDate: null,
      priority: 'medium',
      tags: []
    });
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply filter
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(task => task.status === 'pending');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date()
        );
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'createdAt':
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const isOverdue = (task) => {
    return task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date();
  };

  const renderTaskDialog = () => (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false);
        resetForm();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            fullWidth
            label="Task Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            multiline
            rows={3}
            variant="outlined"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Due Date (Optional)"
              value={taskForm.dueDate}
              onChange={(newValue) => setTaskForm({ ...taskForm, dueDate: newValue })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          {/* AI Suggestions */}
          {!editingTask && (
            <Box>
              <Button
                startIcon={suggestionsLoading ? <CircularProgress size={20} /> : <SmartToyIcon />}
                onClick={handleGetSuggestions}
                disabled={!taskForm.title.trim() || suggestionsLoading}
                sx={{ mb: 2 }}
              >
                Get AI Suggestions
              </Button>
              
              {suggestions.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    AI Suggestions:
                  </Typography>
                  <List>
                    {suggestions.map((suggestion, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton
                          onClick={() => setTaskForm({ ...taskForm, description: suggestion })}
                        >
                          <ListItemText primary={suggestion} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateTask}
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {editingTask ? 'Update' : 'Create'} Task
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTaskList = () => {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
      return (
        <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              No tasks found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks`}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <List>
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            sx={{
              mb: 2,
              background: task.completed 
                ? 'rgba(16, 185, 129, 0.1)' 
                : isOverdue(task)
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(255, 255, 255, 0.05)',
              border: isOverdue(task) ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Checkbox
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleComplete(task)}
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{ color: '#06b6d4', mt: -1 }}
                />
                
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      color: task.status === 'completed' ? 'rgba(255, 255, 255, 0.5)' : 'white',
                      mb: 1
                    }}
                  >
                    {task.title}
                  </Typography>
                  
                  {task.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2,
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority)
                      }}
                    />
                    
                    {task.due_date && (
                      <Chip
                        icon={<CalendarIcon />}
                        label={new Date(task.due_date).toLocaleDateString()}
                        size="small"
                        sx={{
                          backgroundColor: isOverdue(task) 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : 'rgba(6, 182, 212, 0.2)',
                          color: isOverdue(task) ? '#ef4444' : '#06b6d4'
                        }}
                      />
                    )}
                    
                    {isOverdue(task) && (
                      <Chip
                        label="Overdue"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444'
                        }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit task">
                    <IconButton
                      onClick={() => handleEditTask(task)}
                      sx={{ color: '#06b6d4' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Tasks"
        subtitle="Manage your tasks and to-dos with AI assistance"
        icon={<CheckCircleIcon />}
      />

      {/* Authentication Check */}
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to access your tasks.
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isAuthenticated && (
        <>
          {/* Controls */}
          <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  variant="contained"
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Create Task
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                      value={filter}
                      onChange={(e) => dispatch(setFilter(e.target.value))}
                      label="Filter"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => dispatch(setSortBy(e.target.value))}
                      label="Sort By"
                    >
                      <MenuItem value="dueDate">Due Date</MenuItem>
                      <MenuItem value="priority">Priority</MenuItem>
                      <MenuItem value="createdAt">Created</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              {/* Task Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                    {tasks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Tasks
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                    {tasks.filter(t => t.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Pending
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {tasks.filter(t => t.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Completed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                    {tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date()).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Overdue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Task List */}
          {!loading && renderTaskList()}

          {/* Task Dialog */}
          {renderTaskDialog()}
        </>
      )}
    </Container>
  );
};

export default Tasks;