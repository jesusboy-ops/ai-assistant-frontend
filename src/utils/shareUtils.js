// Utility functions for sharing content

export const generateShareUrl = (type, id, options = {}) => {
  const baseUrl = window.location.origin;
  const { token, expires } = options;
  
  let url = `${baseUrl}/shared/${type}/${id}`;
  
  // Add query parameters if needed
  const params = new URLSearchParams();
  if (token) params.append('token', token);
  if (expires) params.append('expires', expires);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return url;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const shareViaWebAPI = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Web Share API not supported' };
};

export const downloadAsFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatShareableContent = (note) => {
  return `${note.title}\n\n${note.content}\n\nShared via Spark AI Assistant`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseEmailList = (emailString) => {
  return emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email && validateEmail(email));
};