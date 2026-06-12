import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { fetchTasks, createTask, updateTask, deleteTask, setFilter, setSortBy, addTaskLocal } from '../store/slices/tasksSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import notificationService from '../services/notificationService';
import toast from '../utils/toast';
import SlidingPanel from '../components/SlidingPanel';

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
    status: 'pending' // Maps to 'To Do', 'in_progress', 'completed'
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'in_progress') return task.status === 'in_progress';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'overdue') {
      return task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
    }
    return true;
  }) : [];

  const columns = {
    pending: {
      name: 'To Do',
      items: filteredTasks.filter(t => t.status === 'pending' || !t.status),
      color: '#3b82f6'
    },
    in_progress: {
      name: 'In Progress',
      items: filteredTasks.filter(t => t.status === 'in_progress'),
      color: '#f59e0b'
    },
    completed: {
      name: 'Completed',
      items: filteredTasks.filter(t => t.status === 'completed'),
      color: '#10b981'
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const task = tasks.find(t => t.id.toString() === draggableId);
      if (task) {
        try {
          const newStatus = destination.droppableId;
          await dispatch(updateTask({
            id: task.id,
            updates: { ...task, status: newStatus }
          })).unwrap();
          toast.success(`Task moved to ${columns[newStatus].name}`);
        } catch (error) {
          toast.error('Failed to move task');
        }
      }
    }
  };

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask.id, updates: taskForm })).unwrap();
        toast.success('Task updated successfully');
      } else {
        try {
          await dispatch(createTask(taskForm)).unwrap();
          toast.success('Task created successfully');
          dispatch(fetchTasks());
        } catch (apiError) {
          const localTask = {
            ...taskForm,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocal: true
          };
          dispatch(addTaskLocal(localTask));
          toast.success('Task created locally');
        }
      }
      setShowTaskDialog(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', status: 'pending' });
    } catch (error) {
      toast.error(error || 'Failed to save task');
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
      } catch (error) {
        toast.error('Failed to delete task');
      }
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

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TaskIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>Tasks</Typography>
            <Typography variant="body2" color="text.secondary">Kanban Board</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} label="Filter" onChange={(e) => dispatch(setFilter(e.target.value))}>
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="pending">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <LoadingSpinner size={40} type="modern" color="#667eea" text="Loading Kanban..." />
        </Box>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Box key={columnId} sx={{ minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: column.color }} />
                    {column.name}
                  </Typography>
                  <Chip size="small" label={column.items.length} sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                </Box>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'rgba(10, 13, 7, 0.4)',
                        borderRadius: 3,
                        p: 2,
                        minHeight: 200,
                        border: '1px dashed rgba(255,255,255,0.1)',
                        transition: 'background 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      {column.items.map((task, index) => (
                        <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <motion.div
                                animate={{
                                  scale: snapshot.isDragging ? 1.05 : 1,
                                  rotate: snapshot.isDragging ? 3 : 0,
                                  boxShadow: snapshot.isDragging ? '0 15px 30px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.1)'
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="container-root"
                              >
                                <Card 
                                  sx={{ 
                                    opacity: columnId === 'completed' && !snapshot.isDragging ? 0.7 : 1,
                                    mb: 0 // Margin is handled by the parent flex gap now
                                  }}
                                >
                                  <CardContent className="card-content-adaptive">
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                                        {task.title || '[No Title]'}
                                      </Typography>
                                      {task.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                          {task.description}
                                        </Typography>
                                      )}
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                        <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} variant="outlined" />
                                        {task.dueDate && (
                                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                            <ScheduleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                            <Typography variant="caption">{new Date(task.dueDate).toLocaleDateString()}</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end', justifyContent: 'center' }}>
                                      <IconButton size="small" onClick={() => handleEditTask(task)}><EditIcon fontSize="small" /></IconButton>
                                      <IconButton size="small" color="error" onClick={() => handleDeleteTask(task.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            ))}
          </Box>
        </DragDropContext>
      )}

      <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => setShowTaskDialog(true)}>
        <AddIcon />
      </Fab>

      <SlidingPanel
        open={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        width="400px"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} multiline rows={4} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={taskForm.priority} label="Priority" onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Due Date" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={taskForm.status} label="Status" onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                <MenuItem value="pending">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => setShowTaskDialog(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleCreateTask} variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
            </Button>
          </Grid>
        </Grid>
      </SlidingPanel>
    </Box>
  );
};

export default Tasks;