// Life Admin Manager Redux slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lifeAdminApi from '../../api/lifeAdminApi';
import notificationService from '../../services/notificationService';

// Async thunks for API calls
export const fetchObligations = createAsyncThunk(
  'lifeAdmin/fetchObligations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await lifeAdminApi.obligations.getAll(params);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch obligations';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchObligationById = createAsyncThunk(
  'lifeAdmin/fetchObligationById',
  async (id) => {
    const response = await lifeAdminApi.obligations.getById(id);
    return response;
  }
);

export const createObligation = createAsyncThunk(
  'lifeAdmin/createObligation',
  async (obligationData) => {
    const response = await lifeAdminApi.obligations.create(obligationData);
    return response;
  }
);

export const updateObligation = createAsyncThunk(
  'lifeAdmin/updateObligation',
  async ({ id, data }) => {
    const response = await lifeAdminApi.obligations.update(id, data);
    return response;
  }
);

export const completeObligation = createAsyncThunk(
  'lifeAdmin/completeObligation',
  async (id) => {
    const response = await lifeAdminApi.obligations.complete(id);
    return response;
  }
);

export const deleteObligation = createAsyncThunk(
  'lifeAdmin/deleteObligation',
  async (id) => {
    await lifeAdminApi.obligations.delete(id);
    return id;
  }
);

export const fetchObligationsByStatus = createAsyncThunk(
  'lifeAdmin/fetchObligationsByStatus',
  async ({ status, params = {} }) => {
    const response = await lifeAdminApi.obligations.getByStatus(status, params);
    return { status, data: response };
  }
);

export const fetchDueSoonObligations = createAsyncThunk(
  'lifeAdmin/fetchDueSoonObligations',
  async (days = 7) => {
    const response = await lifeAdminApi.obligations.getDueSoon(days);
    return response;
  }
);

export const fetchOverdueObligations = createAsyncThunk(
  'lifeAdmin/fetchOverdueObligations',
  async () => {
    const response = await lifeAdminApi.obligations.getOverdue();
    return response;
  }
);

export const generateAIPlan = createAsyncThunk(
  'lifeAdmin/generateAIPlan',
  async (planData) => {
    const response = await lifeAdminApi.ai.generatePlan(planData);
    return response;
  }
);

export const analyzeNotes = createAsyncThunk(
  'lifeAdmin/analyzeNotes',
  async (noteContent) => {
    const response = await lifeAdminApi.ai.analyzeNotes(noteContent);
    return response;
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'lifeAdmin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lifeAdminApi.stats.getDashboard();
      return response;
    } catch (error) {
      // Don't reject, just return default stats
      console.warn('Dashboard stats failed, using defaults:', error.message);
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
);

export const fetchDetailedStats = createAsyncThunk(
  'lifeAdmin/fetchDetailedStats',
  async (period = 'month') => {
    const response = await lifeAdminApi.stats.getDetailed(period);
    return response;
  }
);

export const checkDeadlines = createAsyncThunk(
  'lifeAdmin/checkDeadlines',
  async () => {
    const response = await lifeAdminApi.stats.checkDeadlines();
    return response;
  }
);

export const renewRecurring = createAsyncThunk(
  'lifeAdmin/renewRecurring',
  async () => {
    const response = await lifeAdminApi.stats.renewRecurring();
    return response;
  }
);

export const fetchReminders = createAsyncThunk(
  'lifeAdmin/fetchReminders',
  async (type = 'active') => {
    let response;
    switch (type) {
      case 'active':
        response = await lifeAdminApi.reminders.getActive();
        break;
      case 'upcoming':
        response = await lifeAdminApi.reminders.getUpcoming();
        break;
      case 'overdue':
        response = await lifeAdminApi.reminders.getOverdue();
        break;
      default:
        response = await lifeAdminApi.reminders.getActive();
    }
    return { type, data: response };
  }
);

export const sendEmail = createAsyncThunk(
  'lifeAdmin/sendEmail',
  async (emailData) => {
    const response = await lifeAdminApi.emails.send(emailData);
    return response;
  }
);

export const saveDraftEmail = createAsyncThunk(
  'lifeAdmin/saveDraftEmail',
  async (emailData) => {
    const response = await lifeAdminApi.emails.saveDraft(emailData);
    return response;
  }
);

export const fetchEmailTemplates = createAsyncThunk(
  'lifeAdmin/fetchEmailTemplates',
  async () => {
    const response = await lifeAdminApi.emails.getTemplates();
    return response;
  }
);

export const triggerBackgroundJob = createAsyncThunk(
  'lifeAdmin/triggerBackgroundJob',
  async (jobType) => {
    let response;
    switch (jobType) {
      case 'checkDeadlines':
        response = await lifeAdminApi.jobs.triggerDeadlineCheck();
        break;
      case 'renewRecurring':
        response = await lifeAdminApi.jobs.triggerRecurringRenewal();
        break;
      default:
        throw new Error('Unknown job type');
    }
    return { jobType, data: response };
  }
);

export const fetchJobHistory = createAsyncThunk(
  'lifeAdmin/fetchJobHistory',
  async (params = {}) => {
    const response = await lifeAdminApi.jobs.getJobHistory(params);
    return response;
  }
);

export const fetchReports = createAsyncThunk(
  'lifeAdmin/fetchReports',
  async (reportType) => {
    let response;
    switch (reportType) {
      case 'completionTrends':
        response = await lifeAdminApi.reports.getCompletionTrends();
        break;
      case 'riskAnalysis':
        response = await lifeAdminApi.reports.getRiskAnalysis();
        break;
      case 'categoryBreakdown':
        response = await lifeAdminApi.reports.getCategoryBreakdown();
        break;
      default:
        throw new Error('Unknown report type');
    }
    return { reportType, data: response };
  }
);

const initialState = {
  // Obligations
  obligations: [],
  currentObligation: null,
  obligationsLoading: false,
  obligationsError: null,
  
  // Obligations by status
  obligationsByStatus: {
    active: [],
    completed: [],
    overdue: []
  },
  
  // Due soon and overdue
  dueSoonObligations: [],
  overdueObligations: [],
  
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  
  // Filters
  filters: {
    status: 'all', // all, active, completed, overdue
    category: 'all',
    type: 'all',
    risk_level: 'all',
    sortBy: 'due_date',
    sortOrder: 'asc',
    search: ''
  },
  
  // AI Plan Generation
  aiPlan: null,
  aiPlanLoading: false,
  aiPlanError: null,
  
  // Notes Analysis
  notesAnalysis: null,
  notesAnalysisLoading: false,
  notesAnalysisError: null,
  
  // Dashboard Stats
  stats: {
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
  },
  statsLoading: false,
  statsError: null,
  
  // Detailed Stats
  detailedStats: null,
  detailedStatsLoading: false,
  
  // Reminders
  reminders: {
    active: [],
    upcoming: [],
    overdue: []
  },
  remindersLoading: false,
  remindersError: null,
  
  // Email Management
  emails: {
    templates: [],
    sent: [],
    drafts: []
  },
  emailsLoading: false,
  emailsError: null,
  
  // Background Jobs
  jobsRunning: false,
  lastJobRun: null,
  jobHistory: [],
  jobHistoryLoading: false,
  
  // Reports
  reports: {
    completionTrends: null,
    riskAnalysis: null,
    categoryBreakdown: null
  },
  reportsLoading: false,
  reportsError: null,
  
  // Real-time updates
  realTimeUpdates: {
    escalatedReminders: 0,
    renewedObligations: 0,
    lastUpdate: null
  },
  
  // UI State
  selectedObligations: [],
  bulkActionMode: false,
  viewMode: 'table', // table, cards, calendar
};

const lifeAdminSlice = createSlice({
  name: 'lifeAdmin',
  initialState,
  reducers: {
    // Filter and sorting actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Pagination actions
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Current obligation
    setCurrentObligation: (state, action) => {
      state.currentObligation = action.payload;
    },
    
    clearCurrentObligation: (state) => {
      state.currentObligation = null;
    },
    
    // AI Plan actions
    clearAIPlan: (state) => {
      state.aiPlan = null;
      state.aiPlanError = null;
    },
    
    // Notes Analysis actions
    clearNotesAnalysis: (state) => {
      state.notesAnalysis = null;
      state.notesAnalysisError = null;
    },
    
    // Selection actions
    setSelectedObligations: (state, action) => {
      state.selectedObligations = action.payload;
    },
    
    toggleObligationSelection: (state, action) => {
      const obligationId = action.payload;
      const index = state.selectedObligations.indexOf(obligationId);
      if (index > -1) {
        state.selectedObligations.splice(index, 1);
      } else {
        state.selectedObligations.push(obligationId);
      }
    },
    
    clearSelection: (state) => {
      state.selectedObligations = [];
      state.bulkActionMode = false;
    },
    
    setBulkActionMode: (state, action) => {
      state.bulkActionMode = action.payload;
    },
    
    // View mode
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Real-time updates
    updateRealTimeStats: (state, action) => {
      state.realTimeUpdates = {
        ...state.realTimeUpdates,
        ...action.payload,
        lastUpdate: new Date().toISOString()
      };
    },
    
    // Error clearing
    clearErrors: (state) => {
      state.obligationsError = null;
      state.aiPlanError = null;
      state.notesAnalysisError = null;
      state.statsError = null;
      state.remindersError = null;
      state.emailsError = null;
      state.reportsError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Obligations
    builder
      .addCase(fetchObligations.pending, (state) => {
        state.obligationsLoading = true;
        state.obligationsError = null;
      })
      .addCase(fetchObligations.fulfilled, (state, action) => {
        state.obligationsLoading = false;
        state.obligations = action.payload.obligations || action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0
        };
      })
      .addCase(fetchObligations.rejected, (state, action) => {
        state.obligationsLoading = false;
        state.obligationsError = action.error.message;
      });

    // Fetch Obligation by ID
    builder
      .addCase(fetchObligationById.fulfilled, (state, action) => {
        state.currentObligation = action.payload;
      });

    // Create Obligation
    builder
      .addCase(createObligation.fulfilled, (state, action) => {
        state.obligations.unshift(action.payload);
        state.stats.obligations.total += 1;
        state.stats.obligations.active += 1;
        // Create system notification
        notificationService.obligationCreated(action.payload);
      });

    // Update Obligation
    builder
      .addCase(updateObligation.fulfilled, (state, action) => {
        const index = state.obligations.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.obligations[index] = action.payload;
          // Create system notification
          notificationService.obligationUpdated(action.payload);
        }
        if (state.currentObligation?.id === action.payload.id) {
          state.currentObligation = action.payload;
        }
      });

    // Complete Obligation
    builder
      .addCase(completeObligation.fulfilled, (state, action) => {
        const index = state.obligations.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.obligations[index] = action.payload;
          // Create system notification
          notificationService.obligationCompleted(action.payload);
        }
        state.stats.obligations.active -= 1;
        state.stats.obligations.completed += 1;
      });

    // Delete Obligation
    builder
      .addCase(deleteObligation.fulfilled, (state, action) => {
        state.obligations = state.obligations.filter(o => o.id !== action.payload);
        state.stats.obligations.total -= 1;
      });

    // Fetch Obligations by Status
    builder
      .addCase(fetchObligationsByStatus.fulfilled, (state, action) => {
        const { status, data } = action.payload;
        state.obligationsByStatus[status] = data.obligations || data.data || [];
      });

    // Fetch Due Soon Obligations
    builder
      .addCase(fetchDueSoonObligations.fulfilled, (state, action) => {
        state.dueSoonObligations = action.payload.obligations || action.payload.data || [];
      });

    // Fetch Overdue Obligations
    builder
      .addCase(fetchOverdueObligations.fulfilled, (state, action) => {
        state.overdueObligations = action.payload.obligations || action.payload.data || [];
      });

    // Generate AI Plan
    builder
      .addCase(generateAIPlan.pending, (state) => {
        state.aiPlanLoading = true;
        state.aiPlanError = null;
      })
      .addCase(generateAIPlan.fulfilled, (state, action) => {
        state.aiPlanLoading = false;
        state.aiPlan = action.payload;
      })
      .addCase(generateAIPlan.rejected, (state, action) => {
        state.aiPlanLoading = false;
        state.aiPlanError = action.error.message;
      });

    // Analyze Notes
    builder
      .addCase(analyzeNotes.pending, (state) => {
        state.notesAnalysisLoading = true;
        state.notesAnalysisError = null;
      })
      .addCase(analyzeNotes.fulfilled, (state, action) => {
        state.notesAnalysisLoading = false;
        state.notesAnalysis = action.payload;
      })
      .addCase(analyzeNotes.rejected, (state, action) => {
        state.notesAnalysisLoading = false;
        state.notesAnalysisError = action.error.message;
      });

    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message;
      });

    // Detailed Stats
    builder
      .addCase(fetchDetailedStats.pending, (state) => {
        state.detailedStatsLoading = true;
      })
      .addCase(fetchDetailedStats.fulfilled, (state, action) => {
        state.detailedStatsLoading = false;
        state.detailedStats = action.payload;
      })
      .addCase(fetchDetailedStats.rejected, (state) => {
        state.detailedStatsLoading = false;
      });

    // Reminders
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.remindersLoading = true;
        state.remindersError = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.remindersLoading = false;
        const { type, data } = action.payload;
        state.reminders[type] = data.reminders || data.data || [];
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.remindersLoading = false;
        state.remindersError = action.error.message;
      });

    // Email Templates
    builder
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.emails.templates = action.payload.templates || action.payload.data || [];
      });

    // Background Jobs
    builder
      .addCase(checkDeadlines.pending, (state) => {
        state.jobsRunning = true;
      })
      .addCase(checkDeadlines.fulfilled, (state, action) => {
        state.jobsRunning = false;
        state.lastJobRun = new Date().toISOString();
        if (action.payload.escalated) {
          state.realTimeUpdates.escalatedReminders += action.payload.escalated;
        }
      })
      .addCase(renewRecurring.pending, (state) => {
        state.jobsRunning = true;
      })
      .addCase(renewRecurring.fulfilled, (state, action) => {
        state.jobsRunning = false;
        state.lastJobRun = new Date().toISOString();
        if (action.payload.renewed) {
          state.realTimeUpdates.renewedObligations += action.payload.renewed;
        }
      });

    // Job History
    builder
      .addCase(fetchJobHistory.pending, (state) => {
        state.jobHistoryLoading = true;
      })
      .addCase(fetchJobHistory.fulfilled, (state, action) => {
        state.jobHistoryLoading = false;
        state.jobHistory = action.payload.jobs || action.payload.data || [];
      })
      .addCase(fetchJobHistory.rejected, (state) => {
        state.jobHistoryLoading = false;
      });

    // Reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        const { reportType, data } = action.payload;
        state.reports[reportType] = data;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.error.message;
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  setCurrentObligation,
  clearCurrentObligation,
  clearAIPlan,
  clearNotesAnalysis,
  setSelectedObligations,
  toggleObligationSelection,
  clearSelection,
  setBulkActionMode,
  setViewMode,
  updateRealTimeStats,
  clearErrors
} = lifeAdminSlice.actions;

export default lifeAdminSlice.reducer;