// Toast notification helper
// Simple toast implementation - can be replaced with a library like react-toastify

class ToastManager {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(message, type = 'info') {
    // Ensure message is always a string
    const stringMessage = typeof message === 'string' 
      ? message 
      : message?.message || message?.toString() || 'An error occurred';
    this.listeners.forEach(listener => listener({ message: stringMessage, type }));
  }

  success(message) {
    this.notify(message, 'success');
  }

  error(message) {
    this.notify(message, 'error');
  }

  info(message) {
    this.notify(message, 'info');
  }

  warning(message) {
    this.notify(message, 'warning');
  }
}

export const toast = new ToastManager();

// Export showToast for compatibility with new components
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message)
};

export default toast;
