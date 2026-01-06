// Email API service
import axiosInstance from './axios';

export const emailApi = {
  // Generate email with AI
  generateEmail: async (prompt, tone, context) => {
    try {
      console.log('🔍 Generating email with AI...');
      const response = await axiosInstance.post('/api/email/generate', {
        prompt,
        tone,
        context
      });
      console.log('✅ Email generation response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Generate email error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to generate email'
      };
    }
  },

  // Send email via SendGrid or Gmail
  sendEmail: async (to, subject, body, options = {}) => {
    try {
      console.log('🔍 Sending email to:', to);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return {
          success: false,
          error: 'Invalid email address format'
        };
      }

      // Validate required fields
      if (!subject?.trim()) {
        return {
          success: false,
          error: 'Email subject is required'
        };
      }

      if (!body?.trim()) {
        return {
          success: false,
          error: 'Email body is required'
        };
      }

      const emailData = {
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
        ...options
      };

      const response = await axiosInstance.post('/api/email/send', emailData);
      console.log('✅ Email sent successfully:', response.status, response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Send email error:', error.response?.status, error.response?.data, error.message);
      
      let errorMessage = 'Failed to send email';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Provide specific error messages for common issues
      if (error.response?.status === 401) {
        errorMessage = 'Email service authentication failed. Please check your API keys.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Email service access denied. Please verify your account permissions.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Email sending rate limit exceeded. Please try again later.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Email service is temporarily unavailable. Please try again later.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Generate and send email in one step
  generateAndSend: async (prompt, tone, context, to) => {
    try {
      console.log('🔍 Generating and sending email...');
      const response = await axiosInstance.post('/api/email/generate-and-send', {
        prompt,
        tone,
        context,
        to
      });
      console.log('✅ Generate and send response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Generate and send email error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to generate and send email'
      };
    }
  },

  // Get email history
  getHistory: async () => {
    try {
      console.log('🔍 Fetching email history...');
      const response = await axiosInstance.get('/api/email/history');
      console.log('✅ Email history response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Get email history error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch email history'
      };
    }
  },

  // Check email service configuration
  checkConfiguration: async () => {
    try {
      console.log('🔍 Checking email service configuration...');
      const response = await axiosInstance.get('/api/email/config/check');
      console.log('✅ Email config check response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Email config check error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to check email configuration',
        suggestions: [
          'Verify SendGrid API key is set in environment variables',
          'Check Gmail OAuth configuration if using Gmail',
          'Ensure backend email service is properly configured',
          'Contact administrator if issues persist'
        ]
      };
    }
  },

  // Send test email
  sendTestEmail: async (to) => {
    try {
      console.log('🔍 Sending test email...');
      const response = await axiosInstance.post('/api/email/test', { to });
      console.log('✅ Test email response:', response.status, response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Test email error:', error.response?.status, error.response?.data, error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to send test email'
      };
    }
  }
};

export default emailApi;
