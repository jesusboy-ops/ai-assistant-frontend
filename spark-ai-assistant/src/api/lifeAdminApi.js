// Life Admin Manager API service
import axiosInstance from './axios';

export const lifeAdminApi = {
  // Life Obligations CRUD
  obligations: {
    // Get all obligations with filtering and pagination
    getAll: async (params = {}) => {
      try {
        console.log('🔍 Fetching obligations with params:', params);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.category) queryParams.append('category', params.category);
        if (params.type) queryParams.append('type', params.type);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);
        
        const url = `/api/life-admin/obligations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await axiosInstance.get(url);
        
        console.log('✅ Obligations response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Get obligations error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    },

    // Get single obligation by ID
    getById: async (id) => {
      try {
        console.log('🔍 Fetching obligation by ID:', id);
        const response = await axiosInstance.get(`/api/life-admin/obligations/${id}`);
        console.log('✅ Obligation by ID response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Get obligation by ID error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    },

    // Create new obligation
    create: async (data) => {
      try {
        console.log('🔍 Creating obligation with data:', data);
        
        // Format data according to backend specification
        const formattedData = {
          title: data.title?.trim(),
          category: data.category,
          type: data.type,
          due_date: data.due_date,
          consequence: data.consequence?.trim() || '',
          risk_level: data.risk_level || 'medium'
        };
        
        // Add frequency for recurring obligations
        if (data.type === 'recurring' && data.frequency) {
          formattedData.frequency = data.frequency;
        }
        
        console.log('🔍 Formatted obligation data:', formattedData);
        
        const response = await axiosInstance.post('/api/life-admin/obligations', formattedData);
        console.log('✅ Create obligation response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Create obligation error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    },

    // Update obligation
    update: async (id, data) => {
      try {
        console.log('🔍 Updating obligation:', id, data);
        
        // Format updates according to backend specification
        const formattedUpdates = {};
        if (data.title !== undefined) formattedUpdates.title = data.title?.trim();
        if (data.category !== undefined) formattedUpdates.category = data.category;
        if (data.due_date !== undefined) formattedUpdates.due_date = data.due_date;
        if (data.consequence !== undefined) formattedUpdates.consequence = data.consequence?.trim();
        if (data.risk_level !== undefined) formattedUpdates.risk_level = data.risk_level;
        
        const response = await axiosInstance.put(`/api/life-admin/obligations/${id}`, formattedUpdates);
        console.log('✅ Update obligation response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Update obligation error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    },

    // Complete obligation
    complete: async (id) => {
      try {
        console.log('🔍 Completing obligation:', id);
        const response = await axiosInstance.post(`/api/life-admin/obligations/${id}/complete`);
        console.log('✅ Complete obligation response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Complete obligation error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    },

    // Delete obligation
    delete: async (id) => {
      try {
        console.log('🔍 Deleting obligation:', id);
        const response = await axiosInstance.delete(`/api/life-admin/obligations/${id}`);
        console.log('✅ Delete obligation response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Delete obligation error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    }
  },

  // AI Plan Generation
  ai: {
    // Generate plan from natural language input
    generatePlan: async (data) => {
      try {
        console.log('🔍 Generating AI plan with data:', data);
        
        const requestData = {
          input: data.input || data.message,
          context: data.context || {}
        };
        
        const response = await axiosInstance.post('/api/life-admin/generate-plan', requestData);
        console.log('✅ AI plan response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Generate AI plan error:', error.response?.status, error.response?.data, error.message);
        throw error;
      }
    }
  },

  // Statistics and Monitoring
  stats: {
    // Get dashboard statistics
    getDashboard: async () => {
      try {
        console.log('🔍 Fetching dashboard stats...');
        const response = await axiosInstance.get('/api/life-admin/stats');
        console.log('✅ Dashboard stats response:', response.status, response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Get dashboard stats error:', error.response?.status, error.response?.data, error.message);
        // Return default stats structure if API fails
        return {
          obligations: {
            total: 0,
            active: 0,
            completed: 0,
            overdue: 0,
            high_risk: 0,
            due_soon: 0
          },
          tasks: {
            total: 0,
            pending: 0,
            completed: 0,
            high_priority: 0
          },
          reminders: {
            total: 0,
            active: 0,
            upcoming: 0,
            overdue: 0
          }
        };
      }
    }
  }
};

export default lifeAdminApi;