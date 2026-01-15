// Custom hook for tasks functionality
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  setFilter,
  setSortBy,
  clearError,
  addTaskLocal,
  updateTaskLocal,
  deleteTaskLocal
} from '../store/slices/tasksSlice';
import toast from '../utils/toast';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, filter, sortBy } = useSelector((state) => state.tasks);

  // Load all tasks
  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  // Create new task
  const addTask = async (taskData) => {
    try {
      const result = await dispatch(createTask(taskData)).unwrap();
      toast.success('Task created successfully');
      return result;
    } catch (error) {
      console.error('Failed to create task:', error);
      
      // Fallback to local storage
      dispatch(addTaskLocal(taskData));
      toast.success('Task created locally (will sync when online)');
      return { ...taskData, id: Date.now(), isLocal: true };
    }
  };

  // Update existing task
  const modifyTask = async (taskId, updates) => {
    try {
      const result = await dispatch(updateTask({ id: taskId, updates })).unwrap();
      toast.success('Task updated successfully');
      return result;
    } catch (error) {
      console.error('Failed to update task:', error);
      
      // Fallback to local storage
      dispatch(updateTaskLocal({ id: taskId, updates }));
      toast.success('Task updated locally (will sync when online)');
      return { id: taskId, ...updates };
    }
  };

  // Delete task
  const removeTask = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      
      // Fallback to local storage
      dispatch(deleteTaskLocal(taskId));
      toast.success('Task deleted locally (will sync when online)');
    }
  };

  // Complete/uncomplete task
  const toggleTaskCompletion = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return await modifyTask(task.id, { ...task, status: newStatus });
  };

  // Filter tasks
  const setTaskFilter = (filterValue) => {
    dispatch(setFilter(filterValue));
  };

  // Sort tasks
  const setTaskSort = (sortValue) => {
    dispatch(setSortBy(sortValue));
  };

  // Clear errors
  const clearTaskError = () => {
    dispatch(clearError());
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'overdue') {
        return task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();
      }
      return true;
    });

    return filtered.sort((a, b) => {
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
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => 
      t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    return { total, pending, completed, overdue };
  };

  // Get tasks due today
  const getTasksDueToday = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate).toDateString() === today;
    });
  };

  // Get high priority tasks
  const getHighPriorityTasks = () => {
    return tasks.filter(task => task.priority === 'high' && task.status === 'pending');
  };

  return {
    // State
    tasks,
    loading,
    error,
    filter,
    sortBy,
    
    // Actions
    loadTasks,
    addTask,
    modifyTask,
    removeTask,
    toggleTaskCompletion,
    setTaskFilter,
    setTaskSort,
    clearTaskError,
    
    // Computed values
    filteredTasks: getFilteredTasks(),
    taskStats: getTaskStats(),
    tasksDueToday: getTasksDueToday(),
    highPriorityTasks: getHighPriorityTasks()
  };
};

export default useTasks;