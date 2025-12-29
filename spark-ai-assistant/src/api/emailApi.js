// Email API service
import axiosInstance from './axios';

export const emailApi = {
  // Generate email with AI
  generateEmail: async (prompt, tone, context) => {
    const response = await axiosInstance.post('/api/email/generate', {
      prompt,
      tone,
      context
    });
    return response.data;
  },

  // Send email via SendGrid
  sendEmail: async (to, subject, body) => {
    const response = await axiosInstance.post('/api/email/send', {
      to,
      subject,
      body
    });
    return response.data;
  },

  // Generate and send email in one step
  generateAndSend: async (prompt, tone, context, to) => {
    const response = await axiosInstance.post('/api/email/generate-and-send', {
      prompt,
      tone,
      context,
      to
    });
    return response.data;
  },

  // Get email history
  getHistory: async () => {
    const response = await axiosInstance.get('/api/email/history');
    return response.data;
  }
};

export default emailApi;
