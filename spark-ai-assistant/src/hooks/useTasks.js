// Custom hook for Tasks functionality
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  createTaskFromMessage,
  getTaskSuggestions
} from '../store/slices/tasksSlice';
import { showToast } from '../utils/toast';

export const useTasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state) => state.tasks);

  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const addTask = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      showToast.success('Task created successfully');
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const editTask = async (taskId, updates) => {
    try {
      await dispatch(updateTask({ taskId, updates })).unwrap();
      showToast.success('Task updated successfully');
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const removeTask = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      showToast.success('Task deleted successfully');
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const toggleComplete = async (task) => {
    try {
      await dispatch(toggleTaskComplete({
        taskId: task.id,
        completed: !task.completed
      })).unwrap();
      showToast.success(task.completed ? 'Task marked as pending' : 'Task completed');
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const createFromMessage = async (message) => {
    try {
      await dispatch(createTaskFromMessage(message)).unwrap();
      showToast.success('Task created from message');
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const getSuggestions = async (taskTitle) => {
    try {
      await dispatch(getTaskSuggestions(taskTitle)).unwrap();
      return { success: true };
    } catch (error) {
      showToast.error(error);
      return { success: false, error };
    }
  };

  const getFilteredTasks = () => {
    let filtered = [...tasksState.tasks];

    // Apply filter
    switch (tasksState.filter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
        );
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (tasksState.sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTaskStats = () => {
    const total = tasksState.tasks.length;
    const pending = tasksState.tasks.filter(t => !t.completed).length;
    const completed = tasksState.tasks.filter(t => t.completed).length;
    const overdue = tasksState.tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;

    return { total, pending, completed, overdue };
  };

  return {
    ...tasksState,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    createFromMessage,
    getSuggestions,
    getFilteredTasks,
    getTaskStats
  };
};

export default useTasks;